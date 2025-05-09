import { Request, Response } from "express";
import { messages } from "../../utils/consts";
import { StatusCodes } from "http-status-codes";
import {
  CreateAffiliateLinkService,
  DeleteAffiliateLinkService,
  GetAffiliateLinkByIdService,
  GetAllAffiliateLinksService,
  GetPaginatedAffiliateLinksService,
  UpdateAffiliateLinkService,
} from "../../services/Affiliate/Link.Service";
import { CustomRequest } from "./Affiliate.Controller";

/**
 * Controller to create an affiliate link with an optional promo code.
 *
 * @param {Request} req - The request object containing link data and tokens.
 * @param {Response} res - The response object to send the result or an error message.
 */
export const CreateAffiliateLinkController = async (
  req: CustomRequest,
  res: Response
) => {
  const linkData = req.body;
  const { accessToken, refreshToken, user } = req;

  const { referral_code, id } = user!;

  try {
    const response = await CreateAffiliateLinkService(
      { ...linkData, referralCode: referral_code, userId: id },
      {
        accessToken,
        refreshToken,
      }
    );

    if (!response.ok) {
      console.log("response: ", response);
      return res.status(response.statusCode).json(response);
    }

    return res.status(StatusCodes.CREATED).json(response);
  } catch (error) {
    console.log("ERROR: ", error);
    console.error("Error in CreateAffiliateLinkController:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      body: null,
    });
  }
};

/**
 * Controller to get an affiliate link by ID.
 *
 * @param {Request} req - The request object containing the affiliate link ID.
 * @param {Response} res - The response object to send the result or an error message.
 */
export const GetAffiliateLinkByIdController = async (
  req: CustomRequest,
  res: Response
) => {
  const { id } = req.params;
  const { accessToken, refreshToken, user } = req;

  try {
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        ok: false,
        message: messages.UNAUTHORIZED,
        body: null,
      });
    }
    const response = await GetAffiliateLinkByIdService(Number(id), user.id, {
      refreshToken: refreshToken,
      accessToken: accessToken,
    });

    if (!response.ok) {
      return res.status(response.statusCode).json(response);
    }

    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    console.error("Error in GetAffiliateLinkByIdController:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      body: null,
    });
  }
};

/**
 * Controller to get all affiliate links.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object to send the result or an error message.
 */
export const GetAllAffiliateLinksController = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { accessToken, refreshToken } = req;
    const response = await GetAllAffiliateLinksService({
      accessToken,
      refreshToken,
    });

    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    console.error("Error in GetAllAffiliateLinksController:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      body: null,
    });
  }
};

//

/**
 * Controller to fetch a paginated list of affiliate links.
 *
 * @param {Request} req - The request object containing pagination and filter parameters.
 * @param {Response} res - The response object to send the result or an error message.
 */
export const GetPaginatedAffiliateLinksController = async (
  req: CustomRequest,
  res: Response
) => {
  const { page = 1, size = 10 } = req.query;
  const filters = req.body.filters || {};
  const { accessToken, refreshToken } = req;
  try {
    const response = await GetPaginatedAffiliateLinksService({
      page: Number(page),
      size: Number(size),
      filters,
      tokens: { accessToken, refreshToken },
    });

    if (!response.ok) {
      return res.status(response.statusCode).json(response);
    }

    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    console.log("Error in GetPaginatedAffiliateLinksController:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      body: "null",
    });
  }
};

/**
 * Controller to update an affiliate link by ID.
 *
 * @param {Request} req - The request object containing the affiliate link ID and update data.
 * @param {Response} res - The response object to send the result or an error message.
 */
export const UpdateAffiliateLinkController = async (
  req: CustomRequest,
  res: Response
) => {
  const { id } = req.params;
  const updateData = req.body;
  const { accessToken, refreshToken } = req;

  try {
    const response = await UpdateAffiliateLinkService(Number(id), updateData, {
      accessToken,
      refreshToken,
    });

    if (!response.ok) {
      return res.status(response.statusCode).json({
        ok: false,
        message: response.message,
        body: null,
      });
    }

    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    console.error("Error in UpdateAffiliateLinkController:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      body: null,
    });
  }
};

/**
 * Controller to delete an affiliate link by ID.
 *
 * @param {Request} req - The request object containing the link ID.
 * @param {Response} res - The response object to send the result or an error message.
 */
export const DeleteAffiliateLinkController = async (
  req: CustomRequest,
  res: Response
) => {
  const { id } = req.params;
  const { accessToken, refreshToken } = req;

  try {
    const response = await DeleteAffiliateLinkService(Number(id), {
      accessToken,
      refreshToken,
    });

    if (!response.ok) {
      return res.status(response.statusCode).json(response);
    }

    return res.status(response.statusCode).json(response);
  } catch (error) {
    console.error("Error in DeleteAffiliateLinkController:", error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      body: null,
    });
  }
};

