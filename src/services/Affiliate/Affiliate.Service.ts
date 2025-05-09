import {
  PaginatedServiceResponse,
  ServiceResponse,
} from "../../types/Affiliate/Affiliate.types";
import { messages } from "../../utils/consts";
import { StatusCodes } from "http-status-codes";
import { isSequelizeValidationError } from "../../utils/validations/AffiliateErrorFunction";
import { Affiliate } from "../../models/Affiliate/Affiliate.Model";

/**
 * Create a new Affiliate record in the database
 * @param {Partial<Affiliate>} data - The data to create a new Affiliate record.
 * @returns {Promise<ServiceResponse<Affiliate>>} - A response object containing the status of the operation and the created Affiliate record.
 */

export const CreateAffiliateService = async (
  data: Partial<Affiliate>,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<Affiliate>> => {
  try {
    const affiliate = await Affiliate.create(data);
    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.CREATED,
      body: affiliate,
      tokens,
    };
  } catch (error) {
    if (isSequelizeValidationError(error)) {
      // Sequelize validation error
      if (error.name === "SequelizeValidationError") {
        return {
          ok: false,
          message: error.errors.map((err: any) => err.message),
          statusCode: StatusCodes.BAD_REQUEST,
          body: null,
        };
      }
    }

    // Other Error
    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
};

/**
 * Fetch an affiliate by its ID from the database.
 *
 * @param {string} id - The ID of the affiliate to retrieve.
 * @returns {Promise<ServiceResponse<Affiliate>>} - A response object containing the affiliate data if found.
 */

export const GetAffiliateByIdService = async (
  id: string,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<Affiliate>> => {
  try {
    const affiliate = await Affiliate.findByPk(id);

    if (!affiliate) {
      return {
        ok: false,
        message: messages.NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
      };
    }

    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.OK,
      body: affiliate,
      tokens,
    };
  } catch (error) {
    // Sequelize error
    if (error instanceof Error) {
      return {
        ok: false,
        message: `Failed to fetch affiliate: ${error.message}`,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: null,
      };
    }

    // Fallback for unknown errors
    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
};

/**
 * Fetch a paginated list of affiliate records from the database.
 *
 * @param {number} page - The number of retrieve (1-based index).
 * @param {number} size - The number of records to retrieve per page.
 * @return {Promise<PaginatedServiceResponse<Affiliate>>} - A response object containing the paginated list of affiliate, total count, and pagination details.
 */

export const GetPaginatedAffiliateService = async (
  page: number,
  size: number,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<PaginatedServiceResponse<Affiliate>> => {
  try {
    if (page < 1 || size < 1) {
      return {
        ok: false,
        message: messages.INVALID_PAGINATION,
        statusCode: StatusCodes.BAD_REQUEST,
        body: null,
      };
    }

    // Calculate the offset and limit for the pagination
    const offset = (page - 1) * size;
    const limit = size;

    const { count: totalCount, rows: items } = await Affiliate.findAndCountAll({
      offset,
      limit,
      // Creation Date Order
      order: [["createdAt", "DESC"]],
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / size);

    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.OK,
      body: {
        page,
        size,
        totalCount,
        totalPages,
        items,
      },
      tokens,
    };
  } catch (error) {
    // Sequelize error
    if (error instanceof Error) {
      return {
        ok: false,
        message: `Failed to fetch paginated affiliates: ${error.message}`,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: null,
      };
    }

    // Fallback for unknown errors
    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
};

/**
 * Update an existing affiliate record in the database.
 *
 * @param {string} id - The ID of the affiliate to update.
 * @param {Partial<Affiliate>} data - The new data to update the Affiliate record with.
 * @return {Promise<ServiceResponse<Affiliate>>} - A response object containing the updated Affiliate record or an error message.
 */
export const UpdateAffiliateService = async (
  id: string,
  data: Partial<Affiliate>,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<Affiliate>> => {
  try {
    const affiliate = await Affiliate.findByPk(id);

    if (!affiliate) {
      return {
        ok: false,
        message: messages.NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
      };
    }

    await affiliate.update(data);

    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.OK,
      body: affiliate,
      tokens,
    };
  } catch (error) {
    if (isSequelizeValidationError(error)) {
      // Sequelize validation error
      if (error.name === "SequelizeValidationError") {
        return {
          ok: false,
          message: error.errors.map((err: any) => err.message),
          statusCode: StatusCodes.BAD_REQUEST,
          body: null,
        };
      }
    }

    // Other Error
    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
};

/**
 * Delete an affiliate record from the database.
 *
 * @param {string} id - The ID of the affiliate record to delete.
 * @returns {Promise<ServiceResponse<Affiliate>>} - A response object indicating whether the affiliate was successfully deleted.
 */

export const DeleteAffiliateService = async (
  id: string,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<Affiliate>> => {
  try {
    const affiliate = await Affiliate.findByPk(id);

    if (!affiliate) {
      return {
        ok: false,
        message: messages.NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
      };
    }

    await affiliate.destroy();

    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.NO_CONTENT,
      body: null,
      tokens,
    };
  } catch (error) {
    // Sequelize error
    if (error instanceof Error) {
      return {
        ok: false,
        message: `Failed to delete affiliate: ${error.message}`,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: null,
      };
    }

    // Fallback for unknown errors
    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
};
