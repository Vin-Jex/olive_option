import { Request, Response } from "express";
import {
  CreateClickService,
  DeleteClickService,
  FetchUserClicksStatService,
  GetAllClicksService,
  GetClickByIdService,
  UpdateClickService,
} from "../../services/Affiliate/AffiliateClicks.Service";
import { CustomRequest } from "./Affiliate.Controller";

/**
 * Controller to create a new click record.
 */
export const CreateAffiliateClickController = async (
  req: Request,
  res: Response
) => {
  const { linkId, clickedAt } = req.body;
  const userAgent = req.headers["user-agent"] as string;
  const ipAddress = req.ip;

  const serviceResponse = await CreateClickService({
    linkId,
    clickedAt,
    userAgent,
    ipAddress,
  });

  return res.status(serviceResponse.statusCode).json(serviceResponse);
};

/**
 * Controller to get a click record by ID.
 */
export const GetAffiliateClickByIdController = async (
  req: CustomRequest,
  res: Response
) => {
  const { id } = req.params;
  const { accessToken, refreshToken } = req;
  const serviceResponse = await GetClickByIdService(Number(id), {
    accessToken,
    refreshToken,
  });
  return res.status(serviceResponse.statusCode).json(serviceResponse);
};

/**
 * Controller to get all click records with pagination.
 */
export const GetAllAffiliateClicksController = async (
  req: CustomRequest,
  res: Response
) => {
  const { page, size, searchQuery } = req.query;
  const { accessToken, refreshToken } = req;

  const serviceResponse = await GetAllClicksService(
    {
      page: Number(page) || 1,
      size: Number(size) || 10,
      searchQuery: searchQuery ? String(searchQuery) : undefined,
    },
    {
      accessToken,
      refreshToken,
    }
  );

  return res.status(serviceResponse.statusCode).json(serviceResponse);
};

/**
 * Controller to update a click record by ID.
 */
export const UpdateAffiliateClickController = async (
  req: CustomRequest,
  res: Response
) => {
  const { id } = req.params;
  const { accessToken, refreshToken } = req;
  const updates = req.body;

  const serviceResponse = await UpdateClickService(Number(id), updates, {
    accessToken,
    refreshToken,
  });
  return res.status(serviceResponse.statusCode).json(serviceResponse);
};

/**
 * Controller to delete a click record by ID.
 */
export const DeleteAffiliateClickController = async (
  req: CustomRequest,
  res: Response
) => {
  const { id } = req.params;
  const { accessToken, refreshToken } = req;
  const serviceResponse = await DeleteClickService(Number(id), {
    accessToken,
    refreshToken,
  });
  return res.status(serviceResponse.statusCode).json(serviceResponse);
};

/**
 * Controller to fetch user clicks grouped by date.
 *
 * @param {Request} req - The request object containing the user ID.
 * @param {Response} res - The response object to send the result or an error message.
 */
export const GetUserClicksController = async (
  req: CustomRequest,
  res: Response
) => {
  const { user, accessToken, refreshToken } = req;

  console.log("Response");

  const response = await FetchUserClicksStatService(user?.id as string, {
    accessToken,
    refreshToken,
  });

  return res.status(response.statusCode).json(response);
};
