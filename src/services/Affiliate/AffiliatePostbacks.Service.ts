import { Postback } from "../../models/Affiliate/AffiliatePostbacks.Model";
import { AffiliateUser } from "../../models/Affiliate/AffiliateUser.Model";
import { ServiceResponse } from "../../types/Affiliate/Affiliate.types";
import { messages } from "../../utils/consts";
import { StatusCodes } from "http-status-codes";
import { AffiliateLink } from "../../models/Affiliate/Link.Model";
import { User } from "../../models/User";
import { isSequelizeValidationError } from "../../utils/validations/AffiliateErrorFunction";

/**
 * Create a new postback record.
 *
 * @param {Object} postbackData - Data for the postback.
 * @param {number} postbackData.affiliateId - ID of the affiliate user.
 * @param {number} postbackData.linkId - ID of the affiliate link.
 * @param {string} postbackData.eventId - Unique event identifier.
 * @param {"reg" | "conf" | "ftd" | "dep"} postbackData.status - Status of the event.
 * @param {string} postbackData.clickId - Click ID for tracking.
 * @param {string} postbackData.siteId - Site ID for tracking.
 * @param {string} postbackData.traderId - Trader or user ID.
 * @param {number | null} postbackData.payout - Deposit or payout amount.
 * @param {"GET" | "POST"} postbackData.method - HTTP method for the postback.
 * @param {string} postbackData.url - Postback URL template.
 * @param {Date} postbackData.timestamp - Timestamp for the postback event.
 * @returns {Promise<ServiceResponse<Postback>>} - A response with the created postback record.
 */
export const CreatePostbackService = async (
  postbackData: {
    affiliateId: number;
    linkId: number;
    eventId: string;
    status: "reg" | "conf" | "ftd" | "dep";
    clickId: string;
    siteId: string;
    traderId: string;
    payout: number | null;
    method: "GET" | "POST";
    url: string;
    timestamp: Date;
  },
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<Postback>> => {
  try {
    // Validate Affiliate User
    const affiliate = await AffiliateUser.findByPk(postbackData.affiliateId);
    if (!affiliate) {
      console.log("AFFILIATE: ", affiliate);
      return {
        ok: false,
        message: messages.USER_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
      };
    }

    // Validate Affiliate Link
    const link = await AffiliateLink.findByPk(postbackData.linkId);
    if (!link) {
      return {
        ok: false,
        message: messages.AFFILIATE_LINK_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
      };
    }

    // Validate Trader/User
    if (postbackData.traderId) {
      const trader = await User.findByPk(postbackData.traderId);
      if (!trader) {
        return {
          ok: false,
          message: "Invalid Trader ID or Account not found.",
          statusCode: StatusCodes.NOT_FOUND,
          body: null,
        };
      }
    }

    // Create the Postback
    const newPostback = await Postback.create(postbackData);

    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.CREATED,
      body: newPostback,
      tokens,
    };
  } catch (error) {
    console.error("Error creating postback:", error);
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

/*
 * Get all postbacks associated with a specific user ID.
 *
 * @param {string} userId - Trader ID or User ID to filter postbacks.
 * @returns {Promise<ServiceResponse<Postback[]>>} - A response containing a list of postbacks.
 */
export const GetPostbacksByUserIdService = async (
  userId: string,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<Postback[]>> => {
  try {
    if (!userId || isNaN(Number(userId))) {
      console.error("Invalid user ID");
    }

    const postbacks = await Postback.findAll({
      where: { affiliateId: userId },
    });

    console.log("Postback: ", postbacks);

    if (!postbacks || postbacks.length === 0) {
      return {
        ok: false,
        message: messages.NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: [],
        tokens,
      };
    }

    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.OK,
      body: postbacks,
      tokens,
    };
  } catch (error) {
    console.error("Error fetching postbacks for user:", error);
    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: [],
      tokens,
    };
  }
};

/**
 * Get a postback by ID.
 *
 * @param {number} id - ID of the postback record.
 * @returns {Promise<ServiceResponse<Postback>>} - A response with the postback details.
 */
export const GetPostbackByIdService = async (
  id: number,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<Postback>> => {
  try {
    const postback = await Postback.findByPk(id);

    if (!postback) {
      return {
        ok: false,
        message: messages.NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
        tokens,
      };
    }

    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.OK,
      body: postback,
      tokens,
    };
  } catch (error) {
    console.error("Error fetching postback:", error);
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
 * Update a postback by ID.
 *
 * @param {number} id - ID of the postback record.
 * @param {Partial<Postback>} updateData - Updated data for the postback.
 * @returns {Promise<ServiceResponse<Postback>>} - A response with the updated postback details.
 */
export const UpdatePostbackService = async (
  id: number,
  updateData: Partial<Postback>,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<Postback>> => {
  try {
    const postback = await Postback.findByPk(id);

    if (!postback) {
      return {
        ok: false,
        message: messages.NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
        tokens,
      };
    }

    await postback.update(updateData);

    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.OK,
      body: postback,
      tokens,
    };
  } catch (error) {
    console.error("Error updating postback:", error);
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
 * Delete a postback by ID.
 *
 * @param {number} id - ID of the postback record.
 * @returns {Promise<ServiceResponse<null>>} - A response indicating success or failure of the deletion.
 */
export const DeletePostbackService = async (
  id: number,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<null>> => {
  try {
    const postback = await Postback.findByPk(id);

    if (!postback) {
      return {
        ok: false,
        message: messages.NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
        tokens,
      };
    }

    await postback.destroy();

    return {
      ok: true,
      message: "Postback deleted successfully.",
      statusCode: StatusCodes.OK,
      body: null,
      tokens,
    };
  } catch (error) {
    console.error("Error deleting postback:", error);
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

