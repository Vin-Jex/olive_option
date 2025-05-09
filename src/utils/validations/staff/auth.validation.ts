import * as Joi from "joi";
import { ObjectSchema } from "joi";
import {
  LoginType,
  CreateStaffType,
  ListStaffsType,
  EditStaffPermissionType,
  GetStaffActivitiesType,
  UpdateStaffType,
} from "../../../types/staff/auth.types";
import validator, { paginationValidation2 } from "../../validator";
import { listing_order } from "../../consts";

export const loginValidation = (body: any): LoginType => {
  const schema: ObjectSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return validator(schema, body);
};

export const createStaffValidation = (body: any): CreateStaffType => {
  const schema: ObjectSchema = Joi.object({
    full_name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    is_admin: Joi.boolean().optional().default(false),
    permissions: Joi.object({
      user: Joi.boolean().optional().default(false),
      affiliate: Joi.boolean().optional().default(false),
      financial: Joi.boolean().optional().default(false),
      trade: Joi.boolean().optional().default(false),
      promotional: Joi.boolean().optional().default(false),
    }).required(),
  });

  return validator(schema, body);
};

export const listStaffsValidation = (body: any): ListStaffsType => {
  const schema: ObjectSchema = Joi.object({
    q: Joi.string().optional(),
    page: Joi.number().optional().default(1).min(1),
    size: Joi.number().optional().default(20).min(1),
    order: Joi.any()
      .valid(...Object.values(listing_order))
      .optional()
      .default(listing_order.desc),
    user: Joi.boolean().optional(),
    financial: Joi.boolean().optional(),
    affiliate: Joi.boolean().optional(),
    trade: Joi.boolean().optional(),
    promotional: Joi.boolean().optional(),
    is_admin: Joi.boolean().optional(),
  });

  let values = validator(schema, body);
  return paginationValidation2(values);
};

export const editStaffPermissionValidation = (
  body: any
): EditStaffPermissionType => {
  const schema: ObjectSchema = Joi.object({
    id: Joi.number().required(),
    user: Joi.boolean().optional(),
    affiliate: Joi.boolean().optional(),
    financial: Joi.boolean().optional(),
    trade: Joi.boolean().optional(),
    promotional: Joi.boolean().optional(),
  });

  return validator(schema, body);
};

export const getStaffActivitesValidation = (
  body: any
): GetStaffActivitiesType => {
  const schema: ObjectSchema = Joi.object({
    id: Joi.any().required(),
    q: Joi.string().optional(),
    page: Joi.number().optional().default(1).min(1),
    size: Joi.number().optional().default(20).min(1),
    order: Joi.any()
      .valid(...Object.values(listing_order))
      .optional()
      .default(listing_order.desc),
  });

  let values = validator(schema, body);
  return paginationValidation2(values);
};

export const updateStaffValidation = (body: any): UpdateStaffType => {
  const schema: ObjectSchema = Joi.object({
    first_name: Joi.string().optional(),
    last_name: Joi.string().optional(),
    email: Joi.string().optional(),
    language: Joi.string().optional(),
    enable_email_notifications: Joi.boolean().optional(),
    enable_inapp_notifications: Joi.boolean().optional(),
    two_factor_for_signin: Joi.boolean().optional(),
    two_factor_for_activities: Joi.boolean().optional(),
  });

  return validator(schema, body);
};
