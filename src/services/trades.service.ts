import {
  LeadersBoardType,
  SingleIdType,
  TradeHistoryTypes,
} from "../types/trades.types";
import { ResponseType } from "../types/api.types";
import { User } from "../models/User";
import { order_statuses } from "../utils/consts";
import { Op } from "sequelize";
import { Order } from "../models/Order";
import { messages } from "../utils/consts";
import { StatusCodes } from "http-status-codes";
import { Sequelize } from "sequelize-typescript";

export const getHistoryService = async (
  payload: SingleIdType,
  user: User
): Promise<ResponseType> => {
  const { id } = payload;
  const trade = await Order.findOne({
    where: { id, user_id: user.id, livemode: user.livemode },
  });

  if (!trade) {
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
    body: { trade },
  };
};

export const tradeHistoryService = async (
  payload: TradeHistoryTypes,
  user: User
): Promise<ResponseType> => {
  let { size, page, q, order, pending, period, symbol } = payload;

  let where: any = { livemode: user.livemode, user_id: user.id };

  if (symbol) {
    where.symbol = symbol;
  }

  if (pending != undefined) {
    if (pending == false) {
      where.status = order_statuses.waiting;
    } else {
      where.status = order_statuses.evaluated;
    }
  }

  if (period) {
    let now = new Date(period * 24 * 60 * 60 * 1000);
    where.created_at = { [Op.gte]: now };
  }

  let trades = await Order.findAll({
    where,
    limit: size,
    offset: page,
    order: [["id", order]],
    // Ignoring this for now, to reduce payload size
    // include : [{
    //     model : Transaction,
    //     as : 'transaction'
    // }]
  });

  let total_count = await Order.count({ where });
  let total_pages = Math.ceil(total_count / size);

  if (page > 1) {
    page = Math.ceil(page / size) + 1;
  } else {
    page = 1;
  }

  return {
    ok: true,
    message: messages.OK,
    status: StatusCodes.OK,
    body: { size, page, total_count, total_pages, trades },
  };
};

export const leadersBoardService = async (
  payload: LeadersBoardType
): Promise<ResponseType> => {
  const { period } = payload;

  const leadersboard = await User.findAll({
    attributes: [
      "id",
      "first_name",
      "last_name",
      "pfp_url",
      [
        Sequelize.literal(
          `(SELECT SUM("profit") FROM "trades" WHERE "trades"."user_id" = "User"."id")`
        ),
        "profit",
      ],
    ],
    include: [
      {
        model: Order,
        attributes: [],
        as: "user_orders",
        where: {
          status: order_statuses.evaluated,
          prediction_correct: true,
          livemode: true,
          created_at: {
            [Op.gte]: new Date(
              new Date().getTime() - period * 24 * 60 * 60 * 1000
            ),
          },
        },
        // where : { status : order_statuses.evaluated, prediction_correct : true, created_at : { [Op.gte] : new Date((new Date()).getTime() - period * 24 * 60 * 60 * 1000) } }
        // where : { status : order_statuses.evaluated, prediction_correct : true, created_at : { [Op.gte] : new Date((new Date()).getTime() - period * 24 * 60 * 60 * 1000) } }
        // where : { status : order_statuses.evaluated, prediction_correct : true, created_at : { [Op.gte] : new Date((new Date()).getTime() - period * 24 * 60 * 60 * 1000) } }
      },
    ],
    group: ["User.id"],
    order: [[Sequelize.literal("profit"), "DESC"]],
    limit: 100,
  });

  return {
    ok: true,
    message: messages.OK,
    status: StatusCodes.OK,
    body: { leadersboard },
  };
};
