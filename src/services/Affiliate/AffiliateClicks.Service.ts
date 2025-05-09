import { AffiliateClick } from "../../models/Affiliate/AffiliateClicks.Model";
import {
  PaginatedServiceResponse,
  ServiceResponse,
  TMetaData,
} from "../../types/Affiliate/Affiliate.types";
import { messages } from "../../utils/consts";
import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";
import { generateClickMetadata } from "../../utils/Affiliate/helper";
import { AffiliateLink } from "../../models/Affiliate/Link.Model";

/**
 * Create a new click record.
 *
 * @param {Object} clickData - Data for the click.
 * @param {number} clickData.linkId - ID of the affiliate link.
 * @param {Date} clickData.clickedAt - Date and time of the click event.
 * @param {string} clickData.userAgent - User agent of the click event.
 * @param {string} clickData.ipAddress - IP address of the user.
 * @returns {Promise<ServiceResponse<AffiliateClick>>} - A response with the created click record.
 */
export const CreateClickService = async (
  clickData: {
    linkId: number | null;
    clickedAt: Date;
    userAgent: string;
    ipAddress: string;
  },
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<AffiliateClick>> => {
  try {
    const Link = await AffiliateLink.findByPk(clickData.linkId!);

    if (!Link) {
      return {
        ok: false,
        message: messages.AFFILIATE_LINK_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
      };
    }

    const metadata = await generateClickMetadata(
      clickData.userAgent,
      clickData.ipAddress
    );

    const newClick = await AffiliateClick.create({
      ...clickData,
      userId: Link.userId,
      metadata,
    });

    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.CREATED,
      body: newClick,
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
 * Get click record by ID.
 *
 * @param {number} id - ID of the click record.
 * @returns {Promise<ServiceResponse<AffiliateClick>>} - A response with the click record details.
 */
export const GetClickByIdService = async (
  id: number,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<AffiliateClick>> => {
  try {
    const click = await AffiliateClick.findByPk(id);
    if (!click) {
      return {
        ok: false,
        message: messages.USER_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
        tokens,
      };
    }
    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.OK,
      body: click,
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
 * Get all click records with pagination.
 *
 * @param {Object} query - Pagination and filtering criteria.
 * @param {number} query.page - The page number to retrieve.
 * @param {number} query.size - The number of records per page.
 * @param {string} [query.searchQuery] - Optional search term.
 * @returns {Promise<PaginatedServiceResponse<AffiliateClick>>} - A paginated response with click records.
 */
export const GetAllClicksService = async (
  query: {
    page: number;
    size: number;
    searchQuery?: string;
  },
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<PaginatedServiceResponse<AffiliateClick>> => {
  const { page = 1, size = 10, searchQuery } = query;
  const offset = (page - 1) * size;

  try {
    const whereClause = searchQuery
      ? { metadata: { [Op.iLike]: `%${searchQuery}%` } }
      : {};

    const { count: totalCount, rows: items } =
      await AffiliateClick.findAndCountAll({
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
 * Update a click record by ID.
 *
 * @param {number} id - ID of the click record.
 * @param {Object} updates - Data to update in the click record.
 * @param {object} [updates.metadata] - Updated metadata information.
 * @returns {Promise<ServiceResponse<AffiliateClick>>} - A response with the updated click record.
 */
export const UpdateClickService = async (
  id: number,
  updates: Partial<{ metadata: TMetaData }>,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<AffiliateClick>> => {
  try {
    const click = await AffiliateClick.findByPk(id);
    if (!click) {
      return {
        ok: false,
        message: messages.CLICK_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
        tokens,
      };
    }

    await click.update(updates);

    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.OK,
      body: click,
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
 * Delete a click record by ID.
 *
 * @param {number} id - ID of the click record.
 * @returns {Promise<ServiceResponse<null>>} - A response indicating deletion success or failure.
 */
export const DeleteClickService = async (
  id: number,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<null>> => {
  try {
    const click = await AffiliateClick.findByPk(id);
    if (!click) {
      return {
        ok: false,
        message: messages.CLICK_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
        tokens,
      };
    }

    await click.destroy();
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

export const FetchUserClicksStatService = async (
  userId: string,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<object[]>> => {
  try {
    // Fetch user clicks and group by date
    const clicks = await AffiliateClick.findAll({
      where: { userId },
      attributes: ["clickedAt"],
    });

    const clickCountsByDate = clicks.reduce(
      (acc: Record<string, number>, click) => {
        const date = click.clickedAt.toISOString().split("T")[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {}
    );

    const formattedData = Object.entries(clickCountsByDate).map(
      ([date, counts]) => ({ date, counts })
    );

    return {
      ok: true,
      message: "User clicks fetched successfully.",
      statusCode: StatusCodes.OK,
      body: formattedData,
      tokens,
    };
  } catch (error) {
    console.error("Error fetching user clicks:", error);
    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
      tokens,
    };
  }
};


