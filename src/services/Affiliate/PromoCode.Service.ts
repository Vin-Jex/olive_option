import { ServiceResponse } from "../../types/Affiliate/Affiliate.types";
import { StatusCodes } from "http-status-codes";
import { messages } from "../../utils/consts";
import { PromoCode } from "../../models/Affiliate/PromoCode.Model";
import { generateUniqueCode } from "../../utils/Affiliate/helper";
import { isSequelizeValidationError } from "../../utils/validations/AffiliateErrorFunction";

/**
 * Create a new promo code.
 * @param {string} code - The base promo code string.
 * @param {Partial<PromoCode>} otherData - Additional details such as expiryDate, discountAmount, usageLimit, usedCount.
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @param {string} [tokens.accessToken] - Access token for authentication.
 * @param {string} [tokens.refreshToken] - Refresh token for authentication.
 * @returns {Promise<ServiceResponse<PromoCode>>} - A response with the created promo code.
 */
export const CreatePromoCodeService = async (
  code: string,
  otherData: Partial<PromoCode>,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<PromoCode>> => {
  try {
    // Generate the full promo code by appending a unique 4-digit code
    const uniqueSuffix = generateUniqueCode();
    const fullCode = `${code}${uniqueSuffix}`;

    // Check if promo code already exists
    const existingPromoCode = await PromoCode.findOne({
      where: { code: fullCode },
    });
    if (existingPromoCode) {
      return {
        ok: false,
        message: messages.PROMO_CODE_ALREADY_EXISTS,
        statusCode: StatusCodes.BAD_REQUEST,
        body: null,
      };
    }

    // Create the new promo code with userId and additional details
    const promoCode = await PromoCode.create({
      code: fullCode,
      ...otherData,
    });

    return {
      ok: true,
      message: messages.PROMO_CODE_CREATED,
      statusCode: StatusCodes.CREATED,
      body: promoCode,
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
 * Update an existing promo code by ID.
 * @param {string} id - The ID of the promo code to update.
 * @param {Partial<PromoCode>} updates - The updates to apply to the promo code.
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @param {string} [tokens.accessToken] - Access token for authentication.
 * @param {string} [tokens.refreshToken] - Refresh token for authentication.
 * @returns {Promise<ServiceResponse<PromoCode>>} - A response with the updated promo code.
 */
export const UpdatePromoCodeService = async (
  id: string,
  updates: Partial<PromoCode>,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<PromoCode>> => {
  try {
    const [updatedCount, updatedPromoCodes] = await PromoCode.update(updates, {
      where: { id },
      returning: true,
    });

    if (updatedCount === 0) {
      return {
        ok: false,
        message: messages.PROMO_CODE_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
        tokens,
      };
    }

    return {
      ok: true,
      message: messages.PROMO_CODE_UPDATED,
      statusCode: StatusCodes.OK,
      body: updatedPromoCodes[0],
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
 * Delete a promo code by ID.
 * @param {string} id - The ID of the promo code to delete.
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @param {string} [tokens.accessToken] - Access token for authentication.
 * @param {string} [tokens.refreshToken] - Refresh token for authentication.
 * @returns {Promise<ServiceResponse<void>>} - A response indicating the result of the deletion.
 */
export const DeletePromoCodeService = async (
  id: string,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<void>> => {
  try {
    const deletedCount = await PromoCode.destroy({ where: { id } });

    if (deletedCount === 0) {
      return {
        ok: false,
        message: messages.PROMO_CODE_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
        tokens,
      };
    }

    return {
      ok: true,
      message: messages.PROMO_CODE_DELETED,
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
 * Retrieve a promo code by ID.
 * @param {string} id - The ID of the promo code to retrieve.
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @param {string} [tokens.accessToken] - Access token for authentication.
 * @param {string} [tokens.refreshToken] - Refresh token for authentication.
 * @returns {Promise<ServiceResponse<PromoCode>>} - A response with the found promo code.
 */
export const GetPromoCodeByIdService = async (
  id: string,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<PromoCode>> => {
  try {
    const promoCode = await PromoCode.findOne({ where: { id } });

    if (!promoCode) {
      return {
        ok: false,
        message: messages.PROMO_CODE_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
        tokens,
      };
    }

    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.OK,
      body: promoCode,
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
 * Retrieve all promo codes.
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @param {string} [tokens.accessToken] - Access token for authentication.
 * @param {string} [tokens.refreshToken] - Refresh token for authentication.
 * @returns {Promise<ServiceResponse<PromoCode[]>>} - A response with all promo codes.
 */
export const GetAllPromoCodesService = async (tokens?: {
  accessToken?: string;
  refreshToken?: string;
}): Promise<ServiceResponse<PromoCode[]>> => {
  try {
    const promoCodes = await PromoCode.findAll();

    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.OK,
      body: promoCodes,
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
 * Validate a promo code and update usage.
 * @param {string} code - The promo code to validate.
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @param {string} [tokens.accessToken] - Access token for authentication.
 * @param {string} [tokens.refreshToken] - Refresh token for authentication.
 * @returns {Promise<ServiceResponse<PromoCode>>} - A response indicating if the promo code is valid or not.
 */
export const ValidatePromoCodeService = async (
  code: string,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<PromoCode>> => {
  try {
    // Check if Promo code exists.
    const promoCode = await PromoCode.findOne({ where: { code } });

    if (!promoCode) {
      return {
        ok: false,
        message: messages.PROMO_CODE_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
      };
    }

    // Timestamp
    const now = new Date();

    // Validate if code is still valid
    if (promoCode.expiryDate < now || !promoCode.is_active) {
      return {
        ok: false,
        message: messages.PROMO_CODE_EXPIRED_OR_INACTIVE,
        statusCode: StatusCodes.BAD_REQUEST,
        body: null,
        tokens,
      };
    }

    // Check if promo code usage limit has been reached
    if (promoCode.usageLimit > 0 && promoCode.usedCount >= promoCode.usageLimit) {
      return {
        ok: false,
        message: messages.PROMO_CODE_LIMIT_REACHED,
        statusCode: StatusCodes.BAD_REQUEST,
        body: null,
        tokens,
      };
    }

    // Increment the usedCount
    promoCode.usedCount += 1;

    // Deactivate the code if the usage limit has been reached
    if (promoCode.usedCount >= promoCode.usageLimit) {
      promoCode.is_active = false;
    }

    // Save the updated promo code usage
    await promoCode.save();

    return {
      ok: true,
      message: messages.PROMO_CODE_VALID,
      statusCode: StatusCodes.OK,
      body: promoCode,
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
