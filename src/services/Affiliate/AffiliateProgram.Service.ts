import { ServiceResponse } from "../../types/Affiliate/Affiliate.types";
import { StatusCodes } from "http-status-codes";
import { messages } from "../../utils/consts";
import { isSequelizeValidationError } from "../../utils/validations/AffiliateErrorFunction";
import { AffiliateProgram } from "../../models/Affiliate/AffiliateProgram.Model";

/**
 * Create a new Affiliate Program.
 * @param {string} name - The name of the Affiliate Program.
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @param {string} [tokens.accessToken] - Access token for authentication.
 * @param {string} [tokens.refreshToken] - Refresh token for authentication.
 * @returns {Promise<ServiceResponse<AffiliateProgram>>} - A response with the created Affiliate Program.
 */
export const CreateAffiliateProgramService = async (
  name: string,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<AffiliateProgram>> => {
  try {
    // Check if Affiliate Program already exists
    const existingAffiliateProgram = await AffiliateProgram.findOne({
      where: { name },
    });
    if (existingAffiliateProgram) {
      return {
        ok: false,
        message: messages.AFFILIATE_PROGRAM_ALREADY_EXISTS,
        statusCode: StatusCodes.BAD_REQUEST,
        body: null,
      };
    }

    // Create the new Affiliate Program
    const response = await AffiliateProgram.create({ name });

    return {
      ok: true,
      message: messages.AFFILIATE_PROGRAM_CREATED,
      statusCode: StatusCodes.CREATED,
      body: response,
      tokens,
    };
  } catch (error) {
    if (isSequelizeValidationError(error)) {
      return {
        ok: false,
        message: error.errors.map((err: any) => err.message),
        statusCode: StatusCodes.BAD_REQUEST,
        body: null,
      };
    }

    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
};

/**
 * Retrieve all Affiliate Programs.
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @param {string} [tokens.accessToken] - Access token for authentication.
 * @param {string} [tokens.refreshToken] - Refresh token for authentication.
 * @returns {Promise<ServiceResponse<AffiliateProgram[]>>} - A response with all Affiliate Programs.
 */
export const GetAllAffiliateProgramsService = async (tokens?: {
  accessToken?: string;
  refreshToken?: string;
}): Promise<ServiceResponse<AffiliateProgram[]>> => {
  try {
    const AffiliatePrograms = await AffiliateProgram.findAll();

    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.OK,
      body: AffiliatePrograms,
      tokens,
    };
  } catch (error) {
    if (isSequelizeValidationError(error)) {
      return {
        ok: false,
        message: error.errors.map((err: any) => err.message),
        statusCode: StatusCodes.BAD_REQUEST,
        body: null,
      };
    }

    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
};

/**
 * Retrieve a Affiliate Program by ID.
 * @param {string} id - The ID of the Affiliate Program to retrieve.
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @param {string} [tokens.accessToken] - Access token for authentication.
 * @param {string} [tokens.refreshToken] - Refresh token for authentication.
 * @returns {Promise<ServiceResponse<AffiliateProgram>>} - A response with the found Affiliate Program.
 */
export const GetAffiliateProgramByIdService = async (
  id: string,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<AffiliateProgram>> => {
  try {
    const existingAffiliateProgram = await AffiliateProgram.findOne({
      where: { id },
    });

    if (!existingAffiliateProgram) {
      return {
        ok: false,
        message: messages.AFFILIATE_PROGRAM_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
        tokens,
      };
    }

    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.OK,
      body: existingAffiliateProgram,
      tokens,
    };
  } catch (error) {
    if (isSequelizeValidationError(error)) {
      return {
        ok: false,
        message: error.errors.map((err: any) => err.message),
        statusCode: StatusCodes.BAD_REQUEST,
        body: null,
      };
    }

    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
};

/**
 * Update an existing Affiliate Program by ID.
 * @param {string} id - The ID of the Affiliate Program to update.
 * @param {Partial<AffiliateProgram>} updates - The updates to apply to the Affiliate Program.
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @param {string} [tokens.accessToken] - Access token for authentication.
 * @param {string} [tokens.refreshToken] - Refresh token for authentication.
 * @returns {Promise<ServiceResponse<AffiliateProgram>>} - A response with the updated Affiliate Program.
 */
export const UpdateAffiliateProgramService = async (
  id: string,
  updates: Partial<AffiliateProgram>,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<AffiliateProgram>> => {
  try {
    const [updatedCount, updatedAffiliatePrograms] =
      await AffiliateProgram.update(updates, {
        where: { id },
        returning: true,
      });

    if (updatedCount === 0) {
      return {
        ok: false,
        message: messages.AFFILIATE_PROGRAM_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
        tokens,
      };
    }

    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.OK,
      body: updatedAffiliatePrograms[0],
      tokens,
    };
  } catch (error) {
    if (isSequelizeValidationError(error)) {
      return {
        ok: false,
        message: error.errors.map((err: any) => err.message),
        statusCode: StatusCodes.BAD_REQUEST,
        body: null,
      };
    }

    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
};

/**
 * Delete a Affiliate Program by ID.
 * @param {string} id - The ID of the Affiliate Program to delete.
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @param {string} [tokens.accessToken] - Access token for authentication.
 * @param {string} [tokens.refreshToken] - Refresh token for authentication.
 * @returns {Promise<ServiceResponse<void>>} - A response indicating the result of the deletion.
 */
export const DeleteAffiliateProgramService = async (
  id: string,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<void>> => {
  try {
    const deletedCount = await AffiliateProgram.destroy({ where: { id } });

    if (deletedCount === 0) {
      return {
        ok: false,
        message: messages.AFFILIATE_PROGRAM_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
        tokens,
      };
    }

    return {
      ok: true,
      message: messages.AFFILIATE_PROGRAM_DELETED,
      statusCode: StatusCodes.OK,
      body: null,
      tokens,
    };
  } catch (error) {
    if (isSequelizeValidationError(error)) {
      return {
        ok: false,
        message: error.errors.map((err: any) => err.message),
        statusCode: StatusCodes.BAD_REQUEST,
        body: null,
      };
    }

    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
};

/**
 * Validate a Affiliate Program by name.
 * @param {string} name - The name of the Affiliate Program to validate.
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @param {string} [tokens.accessToken] - Access token for authentication.
 * @param {string} [tokens.refreshToken] - Refresh token for authentication.
 * @returns {Promise<ServiceResponse<existingAffiliateProgram>>} - A response indicating whether the Affiliate Program is valid or not.
 */
export const ValidateAffiliateProgramService = async (
  name: string,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<AffiliateProgram>> => {
  try {
    const affiliateProgram = await AffiliateProgram.findOne({
      where: { name },
    });

    if (!affiliateProgram) {
      return {
        ok: false,
        message: messages.AFFILIATE_PROGRAM_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
        tokens,
      };
    }

    return {
      ok: true,
      message: messages.AFFILIATE_PROGRAM_VALID,
      statusCode: StatusCodes.OK,
      body: affiliateProgram,
      tokens,
    };
  } catch (error) {
    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
};
