import {
  BlockIpType,
  CreateComissionType,
  CreateCustomProfitOutcomeType,
  CreateUpdateSettingType,
  EditComissionType,
  EditCustomProfitOutcomeType,
} from "../../types/staff/setting.types";
import { Setting } from "../../models/Setting";
import { messages } from "../../utils/consts";
import { StatusCodes } from "http-status-codes";
import { ResponseType } from "../../types/api.types";
import { BlockedIp } from "../../models/BlockedIp";
import { SingleIdType } from "../../types/trades.types";
import { GenericPaginationSchemaType } from "../../types/staff/user.types";
import { Op } from "sequelize";
import { CustomProfitOutcome } from "../../models/CustomProfitOutcome";
import { ComissionException } from "../../models/ComissionException";

export const getSettingsService = async (): Promise<ResponseType> => {
  let settings = await Setting.findAll();

  let optimized: any = {};

  for (let i = 0; i < settings.length; i++) {
    let setting = settings[i].dataValues;
    optimized[setting.key] = setting.value;
  }

  return {
    ok: true,
    message: messages.OK,
    status: StatusCodes.OK,
    body: { settings: optimized },
  };
};

export const createUpdateSettingService = async (
  payload: CreateUpdateSettingType
): Promise<ResponseType> => {
  let { key, value } = payload;

  let setting = await Setting.findOne({ where: { key } });

  if (setting) {
    setting.value = value;
  } else {
    setting = await Setting.create({ key, value });
  }

  return await getSettingsService();
};

export const blockIpService = async (
  payload: BlockIpType
): Promise<ResponseType> => {
  const { ip } = payload;

  await BlockedIp.destroy({ where: { ip } });
  await BlockedIp.create({ ip });

  return { ok: true, message: messages.OK, status: StatusCodes.OK };
};

export const unblockIpService = async (
  payload: SingleIdType
): Promise<ResponseType> => {
  const { id } = payload;

  let ip = await BlockedIp.findOne({ where: { id } });

  if (!ip) {
    throw {
      ok: false,
      message: messages.NOT_FOUND,
      status: StatusCodes.NOT_FOUND,
    };
  }

  await BlockedIp.destroy({ where: { id } });

  return { ok: true, message: messages.OK, status: StatusCodes.OK };
};

export const listBlockedIpsService = async (
  payload: GenericPaginationSchemaType
): Promise<ResponseType> => {
  let { q, size, page, order } = payload;

  let where: any = {};

  if (q) {
    where.ip = { [Op.like]: "%" + q + "%" };
  }

  let ips = await BlockedIp.findAll({
    where,
    limit: size,
    offset: page,
    order: [["id", order]],
  });
  let total_count = await BlockedIp.count({ where });
  let total_pages = Math.ceil(total_count / size);

  if (page > 1) {
    page = Math.ceil(page / size) + 1;
  } else {
    page = 1;
  }

  return {
    ok: true,
    status: StatusCodes.OK,
    body: { page, size, total_count, total_pages, ips },
    message: messages.OK,
  };
};

export const createCustomProfitOutcomeService = async (
  payload: CreateCustomProfitOutcomeType
): Promise<ResponseType> => {
  const { ticker, profit_outcome } = payload;

  let search = await CustomProfitOutcome.findOne({ where: { ticker } });

  if (search) {
    throw {
      ok: false,
      message: messages.DUPLICATE_DATA,
      status: StatusCodes.BAD_REQUEST,
    };
  }

  let outcome = await CustomProfitOutcome.create({ ticker, profit_outcome });

  return {
    ok: true,
    message: messages.OK,
    status: StatusCodes.OK,
    body: { outcome },
  };
};

export const editCustomProfitOutcomeService = async (
  payload: EditCustomProfitOutcomeType
): Promise<ResponseType> => {
  const { id, ticker, profit_outcome } = payload;

  let outcome = await CustomProfitOutcome.findOne({ where: { id } });

  if (!outcome) {
    throw {
      ok: false,
      message: messages.NOT_FOUND,
      status: StatusCodes.NOT_FOUND,
    };
  }

  if (ticker) {
    outcome.ticker = ticker;
  }

  if (profit_outcome) {
    outcome.profit_outcome = profit_outcome;
  }

  await outcome.save();

  return {
    ok: true,
    message: messages.OK,
    status: StatusCodes.OK,
    body: { outcome },
  };
};

export const deleteCustomProfitOutcomeService = async (
  payload: SingleIdType
): Promise<ResponseType> => {
  const { id } = payload;

  let outcome = await CustomProfitOutcome.findOne({ where: { id } });

  if (!outcome) {
    throw {
      ok: false,
      message: messages.NOT_FOUND,
      status: StatusCodes.NOT_FOUND,
    };
  }

  await CustomProfitOutcome.destroy({ where: { id } });

  return { ok: true, message: messages.OK, status: StatusCodes.OK };
};

export const listCustomProfitOutcomesService = async (
  payload: GenericPaginationSchemaType
): Promise<ResponseType> => {
  let { q, size, page, order } = payload;

  let where: any = {};

  if (q) {
    where.ticker = { [Op.like]: "%" + q + "%" };
  }

  let outcomes = await CustomProfitOutcome.findAll({
    where,
    limit: size,
    offset: page,
    order: [["id", order]],
  });
  let total_count = await CustomProfitOutcome.count({ where });
  let total_pages = Math.ceil(total_count / size);

  if (page > 1) {
    page = Math.ceil(page / size) + 1;
  } else {
    page = 1;
  }

  return {
    ok: true,
    status: StatusCodes.OK,
    body: { page, size, total_count, total_pages, outcomes },
    message: messages.OK,
  };
};

export const createComissionService = async (
  payload: CreateComissionType
): Promise<ResponseType> => {
  const { ticker, sell_commission, buy_commission } = payload;

  let comission = await ComissionException.findOne({ where: { ticker } });

  if (comission) {
    throw {
      ok: false,
      message: messages.DUPLICATE_DATA,
      status: StatusCodes.BAD_REQUEST,
    };
  }

  comission = await ComissionException.create({
    ticker,
    sell_commission,
    buy_commission,
  });

  return {
    ok: true,
    message: messages.OK,
    status: StatusCodes.OK,
    body: { comission },
  };
};

export const editComissionService = async (
  payload: EditComissionType
): Promise<ResponseType> => {
  const { id, ticker, sell_commission, buy_commission } = payload;

  let comission = await ComissionException.findOne({ where: { id } });

  if (!comission) {
    throw {
      ok: false,
      message: messages.NOT_FOUND,
      status: StatusCodes.NOT_FOUND,
    };
  }

  if (ticker) {
    comission.ticker = ticker;
  }

  if (sell_commission) {
    comission.sell_commission = sell_commission;
  }
  if (buy_commission) {
    comission.buy_commission = buy_commission;
  }

  await comission.save();

  return {
    ok: true,
    message: messages.OK,
    status: StatusCodes.OK,
    body: { comission },
  };
};

export const deleteComissionService = async (
  payload: SingleIdType
): Promise<ResponseType> => {
  const { id } = payload;

  let comission = await ComissionException.findOne({ where: { id } });

  if (!comission) {
    throw {
      ok: false,
      message: messages.NOT_FOUND,
      status: StatusCodes.NOT_FOUND,
    };
  }

  await ComissionException.destroy({ where: { id } });

  return { ok: true, message: messages.OK, status: StatusCodes.OK };
};

export const listComissionsService = async (
  payload: GenericPaginationSchemaType
): Promise<ResponseType> => {
  let { q, size, page, order } = payload;

  let where: any = {};

  if (q) {
    where.ticker = { [Op.like]: "%" + q + "%" };
  }

  let comissions = await ComissionException.findAll({
    where,
    limit: size,
    offset: page,
    order: [["id", order]],
  });
  let total_count = await ComissionException.count({ where });
  let total_pages = Math.ceil(total_count / size);

  if (page > 1) {
    page = Math.ceil(page / size) + 1;
  } else {
    page = 1;
  }

  return {
    ok: true,
    status: StatusCodes.OK,
    body: { page, size, total_count, total_pages, comissions },
    message: messages.OK,
  };
};
