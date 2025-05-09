import { User } from "../models/User";
import { ResponseType } from "../types/api.types";
import { Wallet } from "../models/Wallet";
import {
  kafka_topics,
  messages,
  order_prediction_types,
  order_statuses,
  polygon_endpoints,
  request_methods,
  transaction_statuses,
  transaction_type,
  user_roles,
} from "../utils/consts";
import { StatusCodes } from "http-status-codes";
import {
  InitFunWalletType,
  InitPayoutType,
  ListTransactionsType,
  PlaceOrderType,
} from "../types/wallet.types";
import { log } from "../utils/logger";
import { openRequest } from "../utils/network";
import env from "../config/config";
import { Transaction } from "../models/Transaction";
import { sequelize } from "../config/database";
import { Order } from "../models/Order";
import { Op } from "sequelize";
import { SingleIdType } from "../types/trades.types";
import { initNowPayPayment, initNowPayPayout } from "./nowpay.service";
import { generateRandomNumber } from "../utils/auth";
import { AffiliateUser } from "../models/Affiliate/AffiliateUser.Model";

export const getTransactionService = async (
  payload: SingleIdType,
  user: User | (AffiliateUser & { livemode: boolean }),
  user_type: any = user_roles.user
): Promise<ResponseType> => {
  const { id } = payload;

  let livemode = user_type == user_roles.user ? user.livemode : true;

  let transaction = await Transaction.findOne({
    where: { user_id: user.id, id, livemode, user_type },
    include: [{ model: Order, as: "order" }],
  });

  if (!transaction) {
    throw {
      ok: false,
      message: messages.NOT_FOUND,
      status: StatusCodes.NOT_FOUND,
    };
  }

  return {
    ok: true,
    message: messages.OK,
    status: StatusCodes.OK,
    body: { transaction },
  };
};

export const listTransactionsService = async (
  payload: ListTransactionsType,
  user: User | (AffiliateUser & { livemode: boolean })
): Promise<ResponseType> => {
  let { limit, offset, type, status, date_from, date_to, user_type } = payload;

  let livemode = user_type == user_roles.user ? user.livemode : true;

  let where: any = { user_id: user.id, livemode, user_type };

  if (type) {
    where.type = type;
  }

  if (status) {
    where.status = status;
  }

  if (date_from && date_to) {
    where.created_at = { [Op.between]: [date_from, date_to] };
  } else if (date_from && !date_to) {
    where.created_at = { [Op.between]: [date_from, new Date()] };
  } else if (!date_from && date_to) {
    where.created_at = { [Op.between]: [new Date(), date_to] };
  }

  let transactions = await Transaction.findAll({
    where,
    order: [["updated_at", "DESC"]],
    limit,
    offset,
  });

  let total_count = await Transaction.count({ where });
  let total_pages = Math.ceil(total_count / limit);

  offset = offset > 0 ? offset / limit : offset;

  return {
    ok: true,
    message: messages.OK,
    status: StatusCodes.OK,
    body: { limit, offset, total_count, total_pages, transactions },
  };
};

export const getWalletService = async (
  user: User | (AffiliateUser & { livemode: boolean }),
  user_type: any = user_roles.user
): Promise<ResponseType> => {
  let livemode = user_type == user_roles.user ? user.livemode : true;

  let searchWallet = await Wallet.findOne({
    where: { user_id: user.id, livemode, user_type },
  });

  if (!searchWallet) {
    searchWallet = await Wallet.create({
      user_id: user.id,
      livemode,
      user_type,
    });
  }

  return {
    ok: true,
    message: messages.OK,
    status: StatusCodes.OK,
    body: { wallet: searchWallet },
  };
};

export const resetWalletService = async (user: User): Promise<ResponseType> => {
  user.livemode = false;
  await getWalletService(user);
  await Wallet.update(
    { balance: 100000 },
    { where: { user_id: user.id, livemode: false } }
  );

  return await getWalletService(user);
};

export const updateWalletBalance = async (
  user: User | (AffiliateUser & { livemode: boolean }),
  amount: number,
  type: transaction_type,
  user_type: any = user_roles.user
): Promise<ResponseType> => {
  if (user_type == user_roles.affiliate) {
    user.livemode = true;
  }
  let wallet = (await getWalletService(user, user_type)).body.wallet;

  let balance = parseFloat(wallet.balance);

  if (type == transaction_type.credit) {
    balance = balance + amount;
  } else {
    balance = balance - amount;
  }

  if (balance < 0) {
    throw {
      ok: false,
      message: messages.INSUFFICIENT_BALANCE,
      status: StatusCodes.BAD_REQUEST,
    };
  }
  await Wallet.update({ balance }, { where: { id: wallet.id } });
  return await getWalletService(user);
};

export const placeOrderService = async (
  payload: PlaceOrderType,
  user_id: string
): Promise<ResponseType> => {
  const { expiration, option, amount, prediction } = payload;

  // Validate payload keys
  for (const [key, value] of Object.entries(payload)) {
    if (!value) {
      throw {
        ok: false,
        message: `${key} is required.`,
        status: StatusCodes.BAD_REQUEST,
      };
    }
  }

  // Validate user
  const user = await User.findOne({ where: { id: user_id } });
  if (!user) {
    throw {
      ok: false,
      message: messages.UNAUTHORIZED,
      status: StatusCodes.UNAUTHORIZED,
    };
  }

  if (user.is_disabled) {
    throw {
      ok: false,
      message: messages.ACCOUNT_SUSPENDED,
      status: StatusCodes.BAD_REQUEST,
    };
  }

  const expirationUnix = new Date(expiration).getTime();
  const startUnix = Date.now();

  if (startUnix >= expirationUnix) {
    throw {
      ok: false,
      message: messages.INVALID_EXPIRATION_TIME,
      status: StatusCodes.BAD_REQUEST,
    };
  }

  // Format ticker
  const [base, quote] = option.split("-");
  const formattedTicker = `X:${base}${quote}`;
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;

  const tickerUrl = `${env.POLYGON_BASEURL}${polygon_endpoints.agg_history}${formattedTicker}/range/1/day/${oneDayAgo}/${now}?limit=1`;

  let tickerData: any;

  try {
    tickerData = await openRequest(request_methods.get, tickerUrl, undefined, {
      Authorization: `Bearer ${env.POLYGON_API_KEY}`,
    });

    if (!tickerData?.results?.[0]?.c) {
      throw {
        ok: false,
        message: messages.INVALID_TICKER,
        status: StatusCodes.BAD_REQUEST,
      };
    }
  } catch (error: any) {
    log("error", { error });
    throw error.ok && error.status && error.message
      ? error
      : {
          ok: false,
          message: messages.SERVER_ERROR,
          status: StatusCodes.INTERNAL_SERVER_ERROR,
        };
  }

  const initial_value = tickerData.results[0].c;
  let wallet = (await getWalletService(user)).body.wallet;

  if (wallet.livemode && parseFloat(wallet.balance) < amount) {
    throw {
      ok: false,
      message: messages.INSUFFICIENT_BALANCE,
      status: StatusCodes.BAD_REQUEST,
    };
  }

  let transaction_: any;
  let order: any;

  await sequelize.transaction(async (transaction) => {
    transaction_ = await Transaction.create(
      {
        ref: `${startUnix}-${expirationUnix}-0-${user.id}`,
        amount,
        wallet_id: wallet.id,
        user_id,
        type: transaction_type.debit,
        status: transaction_statuses.completed,
        metadata: JSON.stringify({}),
        livemode: user.livemode,
        desc: "Payment for options contract.",
      },
      { transaction }
    );

    order = await Order.create(
      {
        transaction_id: transaction_.id,
        user_id,
        symbol: option,
        start_time: new Date(startUnix),
        expiry_time: new Date(expirationUnix),
        amount,
        prediction,
        status: order_statuses.waiting,
        initial_value,
        livemode: user.livemode,
      },
      { transaction }
    );

    await Transaction.update(
      { ref: `${startUnix}-${expirationUnix}-${order.id}-${user.id}` },
      { where: { id: transaction_.id }, transaction }
    );
  });

  wallet = (await updateWalletBalance(user, amount, transaction_type.debit))
    .body.wallet;

  return {
    ok: true,
    message: messages.OK,
    status: StatusCodes.OK,
    body: { wallet, order, transaction: transaction_ },
  };
};

export const evaluateOrder = async (
  wallet_id: number,
  user_id: string,
  transaction_id: number,
  order_id: number,
  expirationUnix: number
): Promise<void> => {
  let order = await Order.findOne({
    where: { id: order_id, status: order_statuses.waiting },
  });
  let user = await User.findOne({ where: { id: user_id } });

  if (order && user) {
    let tickerData: any;

    try {
      // tickerData = await openRequest(
      //   request_methods.get,
      //   `${env.POLYGON_BASEURL}${polygon_endpoints.tickers}/${order.symbol}`,
      //   undefined,
      //   { Authorization: `Bearer ${env.POLYGON_API_KEY}` }
      // );

      let newTicker: any = order.symbol.split("-");
      newTicker = `X:${newTicker[0]}${newTicker[1]}`;
      let to: any = new Date().getTime();
      let from: any = new Date(to - 5000).getTime();

      let url = `${env.POLYGON_BASEURL}${polygon_endpoints.agg_history}${newTicker}/range/5/second/${from}/${to}?limit=1`;

      tickerData = await openRequest(request_methods.get, url, undefined, {
        Authorization: `Bearer ${env.POLYGON_API_KEY}`,
      });

      if (!tickerData.results) {
        await Order.update(
          {
            prediction_correct: false,
            status: order_statuses.evaluated,
            completed_value: order.initial_value,
          },
          { where: { id: order_id } }
        );

        return;
      }
    } catch (error: any) {
      log("error", { error });
      throw {
        ok: false,
        message: messages.SERVER_ERROR,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      };
    }

    let correct_prediction: order_prediction_types;

    if (
      parseFloat(tickerData?.results[0]?.c) >
      parseFloat(order.initial_value.toString())
    ) {
      correct_prediction = order_prediction_types.higher;
    } else {
      correct_prediction = order_prediction_types.lower;
    }

    if (correct_prediction == order.prediction) {
      let amountPaid = parseFloat(order.amount.toString());

      // This should be controlled from the admin ideally.
      let PERCENT_GAIN = 90;

      let gain = (PERCENT_GAIN / 100) * amountPaid;
      let totalIncrement = amountPaid + gain;

      await Transaction.create({
        ref: `${expirationUnix}-${order_id}-${user_id}`,
        amount: totalIncrement,
        user_id,
        wallet_id,
        type: transaction_type.credit,
        status: transaction_statuses.completed,
        metadata: JSON.stringify({ order_id }),
        livemode: order.livemode,
        desc: `Reward for correct prediction.`,
      });

      order.profit = gain;

      updateWalletBalance(user, totalIncrement, transaction_type.credit);
    }

    await Order.update(
      {
        prediction_correct: correct_prediction == order.prediction,
        status: order_statuses.evaluated,
        completed_value: parseFloat(tickerData?.results[0]?.c),
      },
      { where: { id: order_id } }
    );
  }
};

export const initFundWalletService = async (
  payload: InitFunWalletType,
  user: User | (AffiliateUser & { livemode: boolean })
): Promise<ResponseType> => {
  const { amount, crypto_currency, user_type } = payload;
  let wallet = (await getWalletService(user, user_type)).body.wallet;

  let payment_details = await initNowPayPayment(
    amount,
    crypto_currency,
    user.email
  );

  if (payment_details == null) {
    throw {
      ok: false,
      message: messages.PAYMENT_FAILED,
      status: StatusCodes.BAD_REQUEST,
    };
  }

  let transaction = await Transaction.create({
    ref: payment_details.payment_id,
    wallet_id: wallet.id,
    user_id: user.id,
    amount,
    type: transaction_type.credit,
    status: transaction_statuses.pending,
    livemode: true,
    user_type,
    desc: `Fund wallet with USD${amount} using ${crypto_currency}`,
    metadata: JSON.stringify(payment_details),
  });

  return {
    ok: true,
    message: messages.OK,
    status: StatusCodes.OK,
    body: { transaction },
  };
};

export const initPayoutService = async (
  payload: InitPayoutType,
  user: User | (AffiliateUser & { livemode: boolean })
): Promise<ResponseType> => {
  const { crypto_currency, amount_in_usd, wallet_address, user_type } = payload;

  let wallet = (await getWalletService(user, user_type)).body.wallet;

  if (parseFloat(wallet.balance) < amount_in_usd) {
    throw {
      ok: false,
      message: messages.INSUFFICIENT_BALANCE,
      status: StatusCodes.BAD_REQUEST,
    };
  }

  let payout_details = await initNowPayPayout(
    crypto_currency,
    amount_in_usd,
    wallet_address
  );

  if (!payout_details) {
    throw {
      ok: false,
      message: messages.PAYOUT_FAILED,
      status: StatusCodes.BAD_REQUEST,
    };
  }

  let transaction = await Transaction.create({
    ref: payout_details.id,
    wallet_id: wallet.id,
    user_id: user.id,
    amount: amount_in_usd,
    type: transaction_type.payout,
    status: transaction_statuses.pending,
    livemode: true,
    user_type,
    desc: `Payout USD${amount_in_usd} to ${crypto_currency}`,
    metadata: JSON.stringify(payout_details),
  });

  await updateWalletBalance(
    user,
    amount_in_usd,
    transaction_type.payout,
    user_type
  );

  return {
    ok: true,
    message: messages.OK,
    status: StatusCodes.OK,
    body: { transaction },
  };
};

export const nowpayPaymentCallbackService = async (
  payload: any
): Promise<ResponseType> => {
  let payment_id = payload.payment_id;
  let batch_withdrawal_id = payload.batch_withdrawal_id;

  if (payment_id || batch_withdrawal_id) {
    if (payment_id && payload.payment_status.toLowerCase() == "finished") {
      let transaction: any = await Transaction.findOne({
        where: {
          livemode: true,
          type: transaction_type.credit,
          status: transaction_statuses.pending,
          ref: `${payment_id}`,
        },
      });

      if (transaction) {
        let user: User | (AffiliateUser & { livemode: boolean });

        if (transaction.user_type == user_roles.user) {
          user = (await User.findOne({
            where: { id: transaction.user_id },
          })) as User;
        } else {
          let affiliateUser = (await AffiliateUser.findOne({
            where: { id: transaction.user_id },
          })) as AffiliateUser;
          user = { ...affiliateUser.dataValues, livemode: true };
        }

        user.livemode = true;

        await updateWalletBalance(
          user,
          parseFloat(transaction.amount),
          transaction_type.credit,
          transaction.user_type
        );
        await Transaction.update(
          { status: transaction_statuses.completed },
          { where: { id: transaction.id } }
        );
      }
    }

    if (batch_withdrawal_id) {
      let transaction: any = await Transaction.findOne({
        where: {
          livemode: true,
          type: transaction_type.payout,
          status: transaction_statuses.pending,
          ref: `${batch_withdrawal_id}`,
        },
      });

      if (payload.payment_status.toLowerCase() == "finished") {
        await Transaction.update(
          { status: transaction_statuses.completed },
          { where: { id: transaction.id } }
        );
      }

      if (
        payload.payment_status.toLowerCase() == "failed" ||
        payload.payment_status.toLowerCase() == "rejected"
      ) {
        let user: User | (AffiliateUser & { livemode: boolean });

        if (transaction.user_type == user_roles.user) {
          user = (await User.findOne({
            where: { id: transaction.user_id },
          })) as User;
        } else {
          let affiliateUser = (await AffiliateUser.findOne({
            where: { id: transaction.user_id },
          })) as AffiliateUser;
          user = { ...affiliateUser.dataValues, livemode: true };
        }

        user.livemode = true;

        await Transaction.update(
          { status: transaction_statuses.failed },
          { where: { id: transaction.id } }
        );
        await updateWalletBalance(
          user,
          parseFloat(transaction.amount),
          transaction_type.credit,
          transaction.user_type
        );
      }
    }
  }

  return { ok: true, message: messages.OK, status: StatusCodes.OK };
};
