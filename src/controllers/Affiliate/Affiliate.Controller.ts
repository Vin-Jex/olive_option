import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  CreateAffiliateService,
  DeleteAffiliateService,
  GetAffiliateByIdService,
  GetPaginatedAffiliateService,
  UpdateAffiliateService,
} from "../../services/Affiliate/Affiliate.Service";
import { messages } from "../../utils/consts";
import { AffiliateUser } from "../../models/Affiliate/AffiliateUser.Model";

export interface CustomRequest extends Request {
  accessToken?: string;
  refreshToken?: string;
  user?: AffiliateUser;
}
/**
 * Controller to create a new affiliate record
 *
 * @param {Request} req - The request object containing the affiliate data in the body.
 * @param {Response} res - The response object that will contain the newly created affiliate record or an error message.
 */
export const createAffiliate = async (req: CustomRequest, res: Response) => {
  const { accessToken, refreshToken } = req;
  const data = req.body;
  try {
    const response = await CreateAffiliateService(data, {
      accessToken,
      refreshToken,
    });
    return res.status(response.statusCode).json(response);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      body: null,
    });
  }
};

/**
 * Controller to get an affiliate by its ID
 *
 * @param {Request} req - The request object with the affiliate ID in the path.
 * @param {Response} res - The response object containing the affiliate data or an error message.
 */
export const getAffiliateById = async (req: CustomRequest, res: Response) => {
  const { accessToken, refreshToken } = req;
  try {
    const { id } = req.params;
    const response = await GetAffiliateByIdService(id, {
      accessToken,
      refreshToken,
    });
    return res.status(response.statusCode).json(response);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      body: null,
    });
  }
};

/**
 * Controller to get a paginated list of affiliates
 *
 * @param {Request} req - The request object containing pagination params `page` and `size` as query parameters.
 * @param {Response} res - The response object with the paginated list of affiliates or an error message.
 */
export const getPaginatedAffiliates = async (
  req: CustomRequest,
  res: Response
) => {
  const { accessToken, refreshToken } = req;
  try {
    const { page = 1, size = 10 } = req.query;
    const response = await GetPaginatedAffiliateService(
      Number(page),
      Number(size),
      {
        accessToken,
        refreshToken,
      }
    );
    return res.status(response.statusCode).json(response);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      body: null,
    });
  }
};

/**
 * Controller to update an existing affiliate by its ID
 *
 * @param {Request} req - The request object containing the affiliate data in the body and the affiliate ID in the path.
 * @param {Response} res - The response object with the updated affiliate or an error message.
 */
export const updateAffiliate = async (req: CustomRequest, res: Response) => {
  const { accessToken, refreshToken } = req;
  try {
    const { id } = req.params;
    const data = req.body;
    const response = await UpdateAffiliateService(id, data, {
      accessToken,
      refreshToken,
    });
    return res.status(response.statusCode).json(response);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      body: null,
    });
  }
};

/**
 * Controller to delete an affiliate by its ID
 *
 * @param {Request} req - The request object with the affiliate ID in the path.
 * @param {Response} res - The response object indicating whether the affiliate was successfully deleted or an error message.
 */
export const deleteAffiliate = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const { accessToken, refreshToken } = req;

  try {
    const response = await DeleteAffiliateService(id, {
      accessToken,
      refreshToken,
    });
    return res.status(response.statusCode).json(response);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      body: null,
    });
  }
};
