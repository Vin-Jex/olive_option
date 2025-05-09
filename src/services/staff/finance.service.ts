import { GetStaffActivitiesType } from "../../types/staff/auth.types";
import { ResponseType } from "../../types/api.types";
import { Transaction } from "../../models/Transaction";
import { Op } from "sequelize";
import { StatusCodes } from "http-status-codes";
import {
  messages,
  transaction_statuses,
  transaction_type,
} from "../../utils/consts";
import {
  ListTransactionType,
  ListWalletsType,
} from "../../types/staff/finance.types";
import { User } from "../../models/User";
import { Wallet } from "../../models/Wallet";
import { SingleIdType } from "../../types/trades.types";
import { Order } from "../../models/Order";

export const listTransactionsService = async (
  payload: ListTransactionType
): Promise<ResponseType> => {
  let {
    q,
    size,
    page,
    order,
    transaction_type,
    transaction_status,
    period,
    payment_method,
    min_amount,
  } = payload;

  let where: any = { livemode: true };

  if (q) {
    where.ref = { [Op.like]: "%" + q + "%" };
  }

  if (transaction_type) {
    where.transaction_type = transaction_type;
  }

  if (transaction_status) {
    where.transaction_status = transaction_status;
  }

  if (period) {
    where.updated_at = { [Op.gte]: new Date(period) };
  }

  if (payment_method) {
    where.payment_method = payment_method;
  }

  if (min_amount) {
    where.amount = { [Op.gte]: min_amount };
  }

  let transactions = await Transaction.findAll({
    where,
    limit: size,
    offset: page,
    order: [["id", order]],
  });
  let total_count = await Transaction.count({ where });
  let total_pages = Math.ceil(total_count / size);

  if (page > 1) {
    page = Math.ceil(page / size) + 1;
  } else {
    page = 1;
  }

  return {
    ok: true,
    status: StatusCodes.OK,
    body: { page, size, total_count, total_pages, transactions },
    message: messages.OK,
  };
};

export const transactionHistoryService = async (
  payload: GetStaffActivitiesType
): Promise<ResponseType> => {
  let { id, q, size, page, order } = payload;

  let where: any = { user_id: id, livemode: true };

  if (q) {
    where.symbol = {
      [Op.or]: [
        { ref: { [Op.like]: "%" + q + "%" } },
        { desc: { [Op.like]: "%" + q + "%" } },
      ],
    };
  }

  let transactions = await Transaction.findAll({
    where,
    limit: size,
    offset: page,
    order: [["id", order]],
  });
  let total_count = await Transaction.count({ where });
  let total_pages = Math.ceil(total_count / size);

  if (page > 1) {
    page = Math.ceil(page / size) + 1;
  } else {
    page = 1;
  }

  return {
    ok: true,
    status: StatusCodes.OK,
    body: { page, size, total_count, total_pages, transactions },
    message: messages.OK,
  };
};

export const dashboardService = async (): Promise<ResponseType> => {
  const total_deposits = await Transaction.sum("amount", {
    where: {
      livemode: true,
      status: transaction_statuses.completed,
      type: transaction_type.credit,
    },
  });
  const total_withdrawals = await Transaction.sum("amount", {
    where: {
      livemode: true,
      status: transaction_statuses.completed,
      type: transaction_type.debit,
    },
  });
  const total_pending_transactions = await Transaction.sum("amount", {
    where: { livemode: true, status: transaction_statuses.pending },
  });
  const total_revenue = 0;
  const total_payout = 0;
  const total_pending_payout = 0;
  const total_pending_withdrawal = await Transaction.sum("amount", {
    where: {
      livemode: true,
      status: transaction_statuses.pending,
      type: transaction_type.debit,
    },
  });

  return {
    ok: true,
    message: messages.OK,
    status: StatusCodes.OK,
    body: {
      total_deposits,
      total_withdrawals,
      total_pending_transactions,
      total_revenue,
      total_payout,
      total_pending_payout,
      total_pending_withdrawal,
    },
  };
};

export const listWalletsService = async (
  payload: ListWalletsType
): Promise<ResponseType> => {
  let { user_id, q, size, page, order } = payload;

  let where: any = { livemode: true };

  if (q) {
    let users = await User.findAll({
      attributes: ["id", "first_name", "last_name", "email"],
      where: {
        [Op.or]: [
          { first_name: { [Op.like]: "%" + q + "%" } },
          { last_name: { [Op.like]: "%" + q + "%" } },
          { email: { [Op.like]: "%" + q + "%" } },
        ],
      },
    });

    let user_ids = users.map((user: any) => {
      return user.id;
    });

    where.user_id = { [Op.in]: user_ids };
  }

  if (user_id) {
    where.user_id = user_id;
  }

  let wallets = await Wallet.findAll({
    where,
    limit: size,
    offset: page,
    order: [["id", order]],
    include: [
      {
        model: User,
        as: "user",
        attributes: [
          "id",
          "first_name",
          "email",
          "created_at",
          "updated_at",
          "is_disabled",
          "pfp_url",
        ],
      },
    ],
  });
  let total_count = await Wallet.count({ where });
  let total_pages = Math.ceil(total_count / size);

  if (page > 1) {
    page = Math.ceil(page / size) + 1;
  } else {
    page = 1;
  }

  return {
    ok: true,
    status: StatusCodes.OK,
    body: { page, size, total_count, total_pages, wallets },
    message: messages.OK,
  };
};

export const getTransactionService = async (
  payload: SingleIdType
): Promise<ResponseType> => {
  const { id } = payload;

  let transaction = await Transaction.findOne({
    where: { id, livemode: true },
    include: [
      {
        model: User,
        as: "transaction_user",
        attributes: ["id", "first_name", "last_name", "email", "is_disabled"],
      },
      {
        model: Wallet,
        as: "transaction_wallet",
      },
      {
        model: Order,
        as: "order",
      },
    ],
  });

  if (!transaction) {
    throw {
      ok: false,
      message: messages.NOT_FOUND,
      status: StatusCodes.BAD_REQUEST,
    };
  }

  return {
    ok: true,
    message: messages.OK,
    status: StatusCodes.OK,
    body: { transaction },
  };
};
