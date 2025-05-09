import { Request, Response } from "express";
import {
  CreateActivityService,
  DeleteActivityService,
  FetchUserClicksAndReferralsStatsService,
  FetchUserReferralsStatsService,
  GetActivityByIdService,
  GetAllActivitiesService,
  UpdateActivityService,
} from "../../services/Affiliate/AffiliateUsersActivities.Service";
import { CustomRequest } from "./Affiliate.Controller";
import { StatusCodes } from "http-status-codes";
import { messages } from "../../utils/consts";

/**
 * Controller to handle the creation of an activity.
 */
export const createActivityController = async (req: Request, res: Response) => {
  const { userId, activityType, affiliateUserId, performedAt } = req.body;

  const userAgent = req.headers["user-agent"] as string;
  const ipAddress = req.ip;
  const response = await CreateActivityService({
    userId,
    activityType,
    affiliateUserId,
    performedAt,
    userAgent,
    ipAddress,
  });
  return res.status(response.statusCode).json(response);
};

/**
 * Controller to get an activity by ID.
 */
export const getActivityByIdController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const response = await GetActivityByIdService(Number(id));
  return res.status(response.statusCode).json(response);
};

/**
 * Controller to get all activities with pagination.
 */
export const getAllActivitiesController = async (
  req: Request,
  res: Response
) => {
  const { page, size, searchQuery } = req.query;
  const response = await GetAllActivitiesService({
    page: Number(page) || 1,
    size: Number(size) || 10,
    searchQuery: searchQuery ? String(searchQuery) : undefined,
  });
  return res.status(response.statusCode).json(response);
};

/**
 * Controller to update an activity by ID.
 */
export const updateActivityController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const response = await UpdateActivityService(Number(id), updates);
  return res.status(response.statusCode).json(response);
};

/**
 * Controller to delete an activity by ID.
 */
export const deleteActivityController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const response = await DeleteActivityService(Number(id));
  return res.status(response.statusCode).json(response);
};

/**
 * Controller to fetch user referrals grouped by date.
 *
 * @param {Request} req - The request object containing the referral ID.
 * @param {Response} res - The response object to send the result or an error message.
 */
export const GetUserReferralsStatsController = async (
  req: CustomRequest,
  res: Response
) => {
  const { user, accessToken, refreshToken } = req;

  try {
    const response = await FetchUserReferralsStatsService(
      user?.referral_code as string,
      { accessToken, refreshToken }
    );

    if (!response.ok) {
      return res.status(response.statusCode).json(response);
    }

    return res.status(response.statusCode).json(response);
  } catch (error) {
    console.error("Error in GetUserReferralsController:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      body: null,
    });
  }
};

/**
 * Controller to fetch user clicks and referrals grouped by date.
 *
 * @param {Request} req - The request object containing user ID and referral ID.
 * @param {Response} res - The response object to send the result or an error message.
 */
export const GetUserClicksAndReferralsStatsController = async (
  req: CustomRequest,
  res: Response
) => {
  const { user, accessToken, refreshToken } = req;

  try {
    const response = await FetchUserClicksAndReferralsStatsService(
      user?.id as string,
      user?.referral_code as string,
      { accessToken, refreshToken }
    );

    if (!response.ok) {
      return res.status(response.statusCode).json(response);
    }

    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    console.error("Error in GetUserClicksAndReferralsController:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      body: null,
    });
  }
};
