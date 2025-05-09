import { AffiliateLink } from "../../models/Affiliate/Link.Model";
import {
  AffiliateLinkQuery,
  PaginatedServiceResponse,
  ServiceResponse,
} from "../../types/Affiliate/Affiliate.types";
import { messages } from "../../utils/consts";
import { StatusCodes } from "http-status-codes";
import { ValidatePromoCodeService } from "../Affiliate/PromoCode.Service";
import { isSequelizeValidationError } from "../../utils/validations/AffiliateErrorFunction";
import { PromoCode } from "../../models/Affiliate/PromoCode.Model";
import { Op } from "sequelize";
import { GetAffiliateProgramByIdService } from "./AffiliateProgram.Service";
import { GetLinkTypeByIdService } from "./LinkType.Service";
import { AffiliateUser } from "../../models/Affiliate/AffiliateUser.Model";
import { LinkType } from "../../models/Affiliate/LinkType.Model";
import { AffiliateProgram } from "../../models/Affiliate/AffiliateProgram.Model";
import { validateReferralCode } from "./AffiliateUser.Service";

/**
 * Create an affiliate link with an optional promo code.
 *
 * @param {Object} linkData - Data for the affiliate link.
 * @param {number} linkData.userId - The ID of the user creating the link.
 * @param {number} linkData.linkTypeId - The ID of the link type.
 * @param {number} linkData.affiliateProgramId - The ID of the affiliate program.
 * @param {string} linkData.link - The URL of the affiliate link.
 * @param {string} [linkData.promoCode] - The optional promo code used.
 * @param {string} [linkData.comment] - An optional comment for the affiliate link.
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @param {string} [tokens.accessToken] - Access token for authentication.
 * @param {string} [tokens.refreshToken] - Refresh token for authentication.
 * @returns {Promise<ServiceResponse<AffiliateLink>>} - A response with the created link.
 */
export const CreateAffiliateLinkService = async (
  linkData: {
    userId: string;
    linkTypeId: string;
    affiliateProgramId: string;
    promoCode?: string;
    referralCode?: string;
    comment?: string;
  },
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<AffiliateLink>> => {
  try {
    let promoCode: PromoCode | null = null;
    let referralCode: boolean | null = null;

    // Validate the promo code if provided
    if (linkData.promoCode) {
      const promoCodeResponse = await ValidatePromoCodeService(
        linkData.promoCode
      );

      if (!promoCodeResponse.ok) {
        console.log("promoCodeResponse: ", promoCodeResponse);
        return {
          ok: false,
          message: promoCodeResponse.message,
          statusCode: promoCodeResponse.statusCode,
          body: null,
          tokens: promoCodeResponse.tokens,
        };
      }

      // Set promoCode to the validated promo code object
      promoCode = promoCodeResponse.body;
    }
    // Validate the referral code if provided
    if (linkData.referralCode) {
      const referralCodeResponse = await validateReferralCode(
        linkData.referralCode
      );

      if (!referralCodeResponse.ok) {
        console.log("referralCodeResponse: ", referralCodeResponse);
        return {
          ok: false,
          message: referralCodeResponse.message,
          statusCode: referralCodeResponse.statusCode,
          body: null,
          tokens: referralCodeResponse.tokens,
        };
      }

      // Set referral to the validated referral code object
      referralCode = referralCodeResponse.body;
    }

    // Validate the affiliate program
    const affiliateProgram = await GetAffiliateProgramByIdService(
      linkData.affiliateProgramId
    );

    if (!affiliateProgram.ok) {
      console.log("affiliateProgram: ", affiliateProgram);

      return affiliateProgram as unknown as ServiceResponse<AffiliateLink>;
    }

    // Validate the link type
    const linkType = await GetLinkTypeByIdService(
      linkData.linkTypeId,
      linkData.userId
    );
    if (!linkType.ok) {
      console.log("linkType: ", linkType);
      return linkType as unknown as ServiceResponse<AffiliateLink>;
    }

    let baseURL: string = linkType.body?.url || "";

    const newAffiliateLink = await AffiliateLink.create({
      userId: linkData.userId,
      linkTypeId: linkData.linkTypeId,
      affiliateProgramId: linkData.affiliateProgramId,
      link: "",
      referralCode: referralCode ? linkData.referralCode : null,
      promoCode: promoCode ? promoCode.code : null,
      comment: linkData.comment || null,
    });

    const finalLink = `${baseURL}/?referralCode=${
      newAffiliateLink.referralCode
    }&promoCode=${newAffiliateLink.promoCode}&id=${
      newAffiliateLink.id
    }&comment=${encodeURIComponent(
      linkData.comment || ""
    )}&linkId=${encodeURIComponent(newAffiliateLink.id || "")}`;

    await newAffiliateLink.update({ link: finalLink });

    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.CREATED,
      body: newAffiliateLink,
      tokens,
    };
  } catch (error) {
    console.log("ERROR: ", error);
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
 * Get affiliate link by ID.
 * @param {number} id - ID of the affiliate link.
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @param {string} [tokens.accessToken] - Access token for authentication.
 * @param {string} [tokens.refreshToken] - Refresh token for authentication.
 * @returns {Promise<ServiceResponse<AffiliateLink>>} - A response with the affiliate link details.
 */
export const GetAffiliateLinkByIdService = async (
  id: number,
  userId: string,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<AffiliateLink>> => {
  try {
    const affiliateLink = await AffiliateLink.findByPk(id);

    if (!affiliateLink) {
      return {
        ok: false,
        message: messages.AFFILIATE_LINK_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
        tokens,
      };
    }

    // Fetch additional link type and program details
    const linkTypeResponse = await GetLinkTypeByIdService(
      affiliateLink.linkTypeId.toString(),
      userId
    );
    if (!linkTypeResponse.ok) {
      return {
        ok: false,
        message: messages.INVALID_LINK_TYPE,
        statusCode: StatusCodes.BAD_REQUEST,
        body: null,
      };
    }

    const programResponse = await GetAffiliateProgramByIdService(
      affiliateLink.affiliateProgramId.toString()
    );
    if (!programResponse.ok) {
      return {
        ok: false,
        message: messages.INVALID_AFFILIATE_PROGRAM,
        statusCode: StatusCodes.BAD_REQUEST,
        body: null,
      };
    }

    // Extend the affiliate link object with linkType and program details
    const fullLinkData = {
      ...affiliateLink.toJSON(),
      linkType: linkTypeResponse.body,
      affiliateProgram: programResponse.body,
    };

    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.OK,
      body: fullLinkData,
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

/**
 * Get all affiliate links.
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @param {string} [tokens.accessToken] - Access token for authentication.
 * @param {string} [tokens.refreshToken] - Refresh token for authentication.
 * @returns {Promise<ServiceResponse<AffiliateLink[]>>} - A response with the list of affiliate links.
 */
export const GetAllAffiliateLinksService = async (tokens?: {
  accessToken?: string;
  refreshToken?: string;
}): Promise<ServiceResponse<AffiliateLink[]>> => {
  try {
    const affiliateLinks = await AffiliateLink.findAll({
      include: [
        {
          model: AffiliateUser,
          as: "user",
          attributes: [
            "id",
            "full_name",
            "email",
            "referral_code",
            "is_active",
            "is_verified",
          ],
        },
        {
          model: LinkType,
          as: "LinkType",
          attributes: ["id", "name", "url"],
        },
        {
          model: AffiliateProgram,
          as: "AffiliateProgram",
          attributes: ["id", "name"],
        },
      ],
    });

    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.OK,
      body: affiliateLinks,
      tokens,
    };
  } catch (error) {
    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: [],
    };
  }
};

/**
 * Fetch a paginated list of affiliate links from the database with optional filtering and sorting.
 *
 * @param {AffiliateLinkQuery} query - An object containing pagination, filtering, and sorting criteria.
 * @param {number} query.page - The page number to retrieve (1-based index).
 * @param {number} query.size - The number of records to retrieve per page.
 * @param {Object} [query.filters] - An optional object for filtering the results.
 * @param {string} [query.filters.searchQuery] - Search term to filter results across multiple fields.
 * @param {string} [query.filters.sortBy] - The field by which to sort the results (e.g., 'created_at', 'link').
 * @param {string} [query.filters.sortOrder] - The order to sort the results; either 'ASC' or 'DESC'.
 * @param {number} [query.filters.affiliateProgramId] - Filter results by affiliate program ID.
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @param {string} [tokens.accessToken] - Access token for authentication.
 * @param {string} [tokens.refreshToken] - Refresh token for authentication.
 *
 * @return {Promise<PaginatedServiceResponse<AffiliateLink>>} - A response object containing the paginated list of affiliate links, total count, and pagination details.
 */
export const GetPaginatedAffiliateLinksService = async (
  query: AffiliateLinkQuery,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<PaginatedServiceResponse<AffiliateLink>> => {
  const { page = 1, size = 10, filters = {} } = query;
  const { searchQuery, sortBy, sortOrder, affiliateProgramId } = filters;

  try {
    // Validate page and size for pagination
    if (page < 1 || size < 1) {
      return {
        ok: false,
        message: messages.INVALID_PAGINATION,
        statusCode: StatusCodes.BAD_REQUEST,
        body: null,
        tokens,
      };
    }

    // Calculate the offset for pagination
    const offset = (page - 1) * size;

    // Prepare the where clause for filtering
    const whereClause: any = {};

    // Filter by affiliateProgramId if provided
    if (affiliateProgramId) {
      whereClause.affiliateProgramId = affiliateProgramId;
    }

    // Searching by multiple fields
    if (searchQuery) {
      whereClause[Op.or] = [
        { id: { [Op.eq]: searchQuery } },
        { link: { [Op.iLike]: `%${searchQuery}%` } },
        { comment: { [Op.iLike]: `%${searchQuery}%` } },
      ];
    }

    // Sorting functionality
    const order: any[] = [];
    if (sortBy) {
      const sortOrderDirection = sortOrder === "DESC" ? "DESC" : "ASC";
      order.push([sortBy, sortOrderDirection]);
    } else {
      // Default sorting by created_at if no sortBy is specified
      order.push(["created_at", "DESC"]);
    }

    // Fetch paginated data
    const data = await AffiliateLink.findAndCountAll({
      where: whereClause,
      offset,
      include: [
        {
          model: AffiliateUser,
          as: "user",
          attributes: [
            "id",
            "full_name",
            "email",
            "referral_code",
            "is_active",
            "is_verified",
          ],
        },
        {
          model: LinkType,
          as: "LinkType",
          attributes: ["id", "name", "url"],
        },
        {
          model: AffiliateProgram,
          as: "AffiliateProgram",
          attributes: ["id", "name"],
        },
      ],
      limit: size,
      order,
    });

    const { count: totalCount, rows: items } = data;

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
    console.log("ERROR", error);
    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
};

/**
 * Update an affiliate link by ID.
 * @param {number} id - The ID of the affiliate link.
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @param {string} [tokens.accessToken] - Access token for authentication.
 * @param {string} [tokens.refreshToken] - Refresh token for authentication.
 * @param {Partial<AffiliateLink>} updateData - The data to update the affiliate link with.
 * @returns {Promise<ServiceResponse<AffiliateLink>>} - A response with the updated affiliate link.
 */
export const UpdateAffiliateLinkService = async (
  id: number,
  updateData: Partial<AffiliateLink>,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<AffiliateLink>> => {
  try {
    const affiliateLink = await AffiliateLink.findByPk(id, {
      include: [
        {
          model: AffiliateUser,
          as: "user",
          attributes: [
            "id",
            "full_name",
            "email",
            "referral_code",
            "is_active",
            "is_verified",
          ],
        },
        {
          model: LinkType,
          as: "LinkType",
          attributes: ["id", "name", "url"],
        },
        {
          model: AffiliateProgram,
          as: "AffiliateProgram",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!affiliateLink) {
      return {
        ok: false,
        message: messages.AFFILIATE_LINK_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
        tokens,
      };
    }

    await affiliateLink.update(updateData);

    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.OK,
      body: affiliateLink,
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

/**
 * Delete an affiliate link by ID.
 * @param {number} id - ID of the affiliate link to be deleted.
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @param {string} [tokens.accessToken] - Access token for authentication.
 * @param {string} [tokens.refreshToken] - Refresh token for authentication.
 * @returns {Promise<ServiceResponse<null>>} - A response indicating success or failure.
 */
export const DeleteAffiliateLinkService = async (
  id: number,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<null>> => {
  try {
    // Find the affiliate link by ID
    const affiliateLink = await AffiliateLink.findByPk(id);

    // If the affiliate link is not found, return a not found response
    if (!affiliateLink) {
      return {
        ok: false,
        message: messages.AFFILIATE_LINK_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
        tokens,
      };
    }

    // Delete the affiliate link
    await affiliateLink.destroy();

    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.NO_CONTENT,
      body: null,
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
