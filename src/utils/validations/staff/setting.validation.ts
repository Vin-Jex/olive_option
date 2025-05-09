import * as Joi from "joi";
import { ObjectSchema } from "joi";
import validator, { paginationValidation2 } from "../../validator";
import { setting_keys } from "../../consts";
import {
  CreateUpdateSettingType,
  BlockIpType,
  CreateCustomProfitOutcomeType,
  EditCustomProfitOutcomeType,
  CreateComissionType,
  EditComissionType,
} from "../../../types/staff/setting.types";

export const createUpdateSettingValidation = (
  body: any
): CreateUpdateSettingType => {
  const schema: ObjectSchema = Joi.object({
    key: Joi.any()
      .valid(...Object.values(setting_keys))
      .required(),
    value: Joi.any().required(),
  });

  return validator(schema, body);
};

export const blockIpValidation = (body: any): BlockIpType => {
  const schema: ObjectSchema = Joi.object({
    ip: Joi.string().required(),
  });

  return validator(schema, body);
};

export const createCustomProfitOutcomeValidation = (
  body: any
): CreateCustomProfitOutcomeType => {
  const schema: ObjectSchema = Joi.object({
    ticker: Joi.string().required(),
    profit_outcome: Joi.number().required(),
  });

  return validator(schema, body);
};

export const editCustomProfitOutcomeValidation = (
  body: any
): EditCustomProfitOutcomeType => {
  const schema: ObjectSchema = Joi.object({
    ticker: Joi.string().optional(),
    profit_outcome: Joi.number().optional(),
    id: Joi.number().required(),
  });

  return validator(schema, body);
};

export const createComissionValidation = (body: any): CreateComissionType => {
  const schema: ObjectSchema = Joi.object({
    ticker: Joi.string().required(),
    sell_commission: Joi.number().required(),
    buy_commission: Joi.number().required(),
  });

  return validator(schema, body);
};

export const editComissionValidation = (body: any): EditComissionType => {
  const schema: ObjectSchema = Joi.object({
    id: Joi.number().required(),
    ticker: Joi.string().optional(),
    sell_commission: Joi.number().optional(),
    buy_commission: Joi.number().optional(),
  });

  return validator(schema, body);
};
