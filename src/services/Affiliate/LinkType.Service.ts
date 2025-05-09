import { ServiceResponse } from "../../types/Affiliate/Affiliate.types";
import { StatusCodes } from "http-status-codes";
import { messages } from "../../utils/consts";
import { LinkType } from "../../models/Affiliate/LinkType.Model";
import { isSequelizeValidationError } from "../../utils/validations/AffiliateErrorFunction";

/**
 * Create a new link type.
 * @param {string} name - The name of the link type.
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @param {string} [tokens.accessToken] - Access token for authentication.
 * @param {string} [tokens.refreshToken] - Refresh token for authentication.
 * @param {string} [tokens.user] - User Object.
 * @returns {Promise<ServiceResponse<LinkType>>} - A response with the created link type.
 */
export const CreateLinkTypeService = async (
  name: string,
  url: string,
  userId?: string,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<LinkType>> => {
  try {
    // Check if link type already exists
    const existingLinkType = await LinkType.findOne({
      where: { name, userId },
    });
    if (existingLinkType) {
      return {
        ok: false,
        message: messages.LINK_TYPE_ALREADY_EXISTS,
        statusCode: StatusCodes.BAD_REQUEST,
        body: null,
      };
    }

    // Create the new link type
    const linkType = await LinkType.create({ name, url, userId });

    return {
      ok: true,
      message: messages.LINK_TYPE_CREATED,
      statusCode: StatusCodes.CREATED,
      body: linkType,
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
 * Retrieve all link types.
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @param {string} [tokens.accessToken] - Access token for authentication.
 * @param {string} [tokens.refreshToken] - Refresh token for authentication.
 * @returns {Promise<ServiceResponse<LinkType[]>>} - A response with all link types.
 */
export const GetAllLinkTypesService = async (
  userId: string,
  tokens?: {
    accessToken?: string;
    refreshToken?: string;
}): Promise<ServiceResponse<LinkType[]>> => {
  try {
    const linkTypes = await LinkType.findAll({});

    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.OK,
      body: linkTypes,
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
 * Retrieve a link type by ID.
 * @param {string} id - The ID of the link type to retrieve.
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @param {string} [tokens.accessToken] - Access token for authentication.
 * @param {string} [tokens.refreshToken] - Refresh token for authentication.
 * @returns {Promise<ServiceResponse<LinkType>>} - A response with the found link type.
 */
export const GetLinkTypeByIdService = async (
  id: string,
  userId?: string,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<LinkType>> => {
  try {
    const linkType = await LinkType.findOne({ where: { id } });

    if (!linkType) {
      return {
        ok: false,
        message: messages.LINK_TYPE_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
        tokens,
      };
    }

    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.OK,
      body: linkType,
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
 * Update an existing link type by ID.
 * @param {string} id - The ID of the link type to update.
 * @param {Partial<LinkType>} updates - The updates to apply to the link type.
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @param {string} [tokens.accessToken] - Access token for authentication.
 * @param {string} [tokens.refreshToken] - Refresh token for authentication.
 * @returns {Promise<ServiceResponse<LinkType>>} - A response with the updated link type.
 */
export const UpdateLinkTypeService = async (
  id: string,
  updates: Partial<LinkType>,
  userId?: string,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<LinkType>> => {
  try {
    const [updatedCount, updatedLinkTypes] = await LinkType.update(updates, {
      where: { id, userId },
      returning: true,
    });

    if (updatedCount === 0) {
      return {
        ok: false,
        message: messages.LINK_TYPE_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
        tokens,
      };
    }

    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.OK,
      body: updatedLinkTypes[0],
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
 * Delete a link type by ID.
 * @param {string} id - The ID of the link type to delete.
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @param {string} [tokens.accessToken] - Access token for authentication.
 * @param {string} [tokens.refreshToken] - Refresh token for authentication.
 * @returns {Promise<ServiceResponse<void>>} - A response indicating the result of the deletion.
 */
export const DeleteLinkTypeService = async (
  id: string,
  userId?: string,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<void>> => {
  try {
    const deletedCount = await LinkType.destroy({
      where: { id, userId },
    });

    if (deletedCount === 0) {
      return {
        ok: false,
        message: messages.LINK_TYPE_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
        tokens,
      };
    }

    return {
      ok: true,
      message: messages.LINK_TYPE_DELETED,
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
 * Validate a link type by name.
 * @param {string} name - The name of the link type to validate.
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @param {string} [tokens.accessToken] - Access token for authentication.
 * @param {string} [tokens.refreshToken] - Refresh token for authentication.
 * @returns {Promise<ServiceResponse<LinkType>>} - A response indicating whether the link type is valid or not.
 */
export const ValidateLinkTypeService = async (
  name: string,
  userId?: string,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<LinkType>> => {
  try {
    const linkType = await LinkType.findOne({ where: { name, userId } });

    if (!linkType) {
      return {
        ok: false,
        message: messages.LINK_TYPE_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
        tokens,
      };
    }

    return {
      ok: true,
      message: messages.LINK_TYPE_VALID,
      statusCode: StatusCodes.OK,
      body: linkType,
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
