import { ObjectSchema } from "joi";
import { StatusCodes } from "http-status-codes";

export default (schema: ObjectSchema, body: any) => {
  const { error, value } = schema.validate(body);

  if (error) {
    throw {
      ok: false,
      message: error.details[0].message,
      status: StatusCodes.BAD_REQUEST,
    };
  }

  return value;
};

export const paginationValidation = (values: any): any => {
  if (values.offset > 0) {
    values.offset *= values.limit;
  }

  return values;
};

export const paginationValidation2 = (values: any): any => {
  values.page -= 1;

  if (values.page > 0) {
    values.page *= values.size;
  }

  return values;
};
