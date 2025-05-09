import { AffiliateUserActivity } from "../../models/Affiliate/AffiliateActivities.Model";
import {
  EActivityType,
  PaginatedServiceResponse,
  ServiceResponse,
} from "../../types/Affiliate/Affiliate.types";
import { messages } from "../../utils/consts";
import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";
import { generateClickMetadata } from "../../utils/Affiliate/helper";
import { AffiliateUser } from "../../models/Affiliate/AffiliateUser.Model";
import { FetchUserClicksStatService } from "./AffiliateClicks.Service";

/**
 * Create a new activity record.
 *
 * @param {Object} activityData - Data for the activity.
 * @param {number} activityData.userId - ID of the affiliate user.
 * @param {string} activityData.activityType - Type of the activity (e.g., "sign_in", "sign_up").
 * @param {number} [activityData.affiliateUserId] - Optional ID of the related affiliate user.
 * @param {Date} activityData.performedAt - Date and time of the activity event.
 * @param {object} [activityData.metadata] - Optional additional metadata for the activity.
 * @returns {Promise<ServiceResponse<AffiliateUserActivity>>} - A response with the created activity record.
 */
export const CreateActivityService = async (
  activityData: {
    userId: string;
    activityType: EActivityType;
    affiliateUserId?: number | null;
    performedAt: Date;
    userAgent: string;
    ipAddress: string;
  },
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<AffiliateUserActivity>> => {
  try {
    const metadata = await generateClickMetadata(
      activityData.userAgent,
      activityData.ipAddress
    );
    const newActivity = await AffiliateUserActivity.create({
      ...activityData,
      metadata,
    });

    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.CREATED,
      body: newActivity,
      tokens,
    };
  } catch (error) {
    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
      tokens,
    };
  }
};

/**
 * Get activity record by ID.
 *
 * @param {number} id - ID of the activity record.
 * @returns {Promise<ServiceResponse<AffiliateUserActivity>>} - A response with the activity record details.
 */
export const GetActivityByIdService = async (
  id: number,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<AffiliateUserActivity>> => {
  try {
    const activity = await AffiliateUserActivity.findByPk(id);
    if (!activity) {
      return {
        ok: false,
        message: messages.ACTIVITY_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
        tokens,
      };
    }
    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.OK,
      body: activity,
      tokens,
    };
  } catch (error) {
    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
      tokens,
    };
  }
};

/**
 * Get all activity records with pagination.
 *
 * @param {Object} query - Pagination and filtering criteria.
 * @param {number} query.page - The page number to retrieve.
 * @param {number} query.size - The number of records per page.
 * @param {string} [query.searchQuery] - Optional search term.
 * @returns {Promise<PaginatedServiceResponse<AffiliateUserActivity>>} - A paginated response with activity records.
 */
export const GetAllActivitiesService = async (
  query: {
    page: number;
    size: number;
    searchQuery?: string;
  },
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<PaginatedServiceResponse<AffiliateUserActivity>> => {
  const { page = 1, size = 10, searchQuery } = query;
  const offset = (page - 1) * size;

  try {
    const whereClause = searchQuery
      ? { activityType: { [Op.iLike]: `%${searchQuery}%` } }
      : {};

    const { count: totalCount, rows: items } =
      await AffiliateUserActivity.findAndCountAll({
        where: whereClause,
        offset,
        limit: size,
        order: [["created_at", "DESC"]],
      });

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
    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
      tokens,
    };
  }
};

/**
 * Update an activity record by ID.
 *
 * @param {number} id - ID of the activity record.
 * @param {Object} updates - Data to update in the activity record.
 * @param {object} [updates.metadata] - Updated metadata information.
 * @returns {Promise<ServiceResponse<AffiliateUserActivity>>} - A response with the updated activity record.
 */
export const UpdateActivityService = async (
  id: number,
  updates: Partial<{ metadata: object }>,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<AffiliateUserActivity>> => {
  try {
    const activity = await AffiliateUserActivity.findByPk(id);
    if (!activity) {
      return {
        ok: false,
        message: messages.ACTIVITY_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
        tokens,
      };
    }

    await activity.update(updates);
    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.OK,
      body: activity,
      tokens,
    };
  } catch (error) {
    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
      tokens,
    };
  }
};

/**
 * Delete an activity record by ID.
 *
 * @param {number} id - ID of the activity record.
 * @returns {Promise<ServiceResponse<null>>} - A response indicating deletion success or failure.
 */
export const DeleteActivityService = async (
  id: number,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<null>> => {
  try {
    const activity = await AffiliateUserActivity.findByPk(id);
    if (!activity) {
      return {
        ok: false,
        message: messages.ACTIVITY_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
        tokens,
      };
    }

    await activity.destroy();
    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.OK,
      body: null,
      tokens,
    };
  } catch (error) {
    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
      tokens,
    };
  }
};

export const FetchUserReferralsStatsService = async (
  referralId: string,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<object[]>> => {
  try {
    // Fetch referrals based on referralId
    const referrals = await AffiliateUser.findAll({
      where: { referral_code: referralId },
      attributes: ["created_at"],
    });

    // Group referrals by date and count them
    const referralCountsByDate = referrals.reduce(
      (acc: Record<string, number>, referral) => {
        const date = referral.created_at.toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {}
    );

    // Format the grouped data
    const formattedData = Object.entries(referralCountsByDate).map(
      ([date, counts]) => ({ date, counts })
    );

    return {
      ok: true,
      message: "User referrals fetched successfully.",
      statusCode: StatusCodes.OK,
      body: formattedData,
      tokens,
    };
  } catch (error) {
    console.error("Error fetching user referrals:", error);
    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
      tokens,
    };
  }
};

export const FetchUserClicksAndReferralsStatsService = async (
  userId: string,
  referralId: string,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<object>> => {
  try {
    const clicksResponse = await FetchUserClicksStatService(userId);
    const referralsResponse = await FetchUserReferralsStatsService(referralId);

    if (!clicksResponse.ok || !referralsResponse.ok) {
      return {
        ok: true,
        message: "Failed to fetch clicks or referrals.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: null,
        tokens,
      };
    }

    return {
      ok: true,
      message: "Clicks and referrals fetched successfully.",
      statusCode: StatusCodes.OK,
      body: {
        clicks: clicksResponse.body,
        referrals: referralsResponse.body,
      },
      tokens,
    };
  } catch (error) {
    console.error("Error fetching clicks and referrals:", error);
    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
      tokens,
    };
  }
};
