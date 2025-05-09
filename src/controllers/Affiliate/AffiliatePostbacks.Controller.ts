import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  CreatePostbackService,
  DeletePostbackService,
  GetPostbackByIdService,
  GetPostbacksByUserIdService,
  UpdatePostbackService,
} from "../../services/Affiliate/AffiliatePostbacks.Service";
import { CustomRequest } from "./Affiliate.Controller";

/**
 * Create a new postback.
 */
export const CreatePostbackController = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  const { body, accessToken, refreshToken, user } = req;

  const response = await CreatePostbackService(
    { affiliateId: user?.id, ...body },
    {
      accessToken,
      refreshToken,
    }
  );

  return res.status(response.statusCode).json(response);
};

/**
 * Get a postback by ID.
 */
export const GetPostbackByIdController = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { accessToken, refreshToken } = req;
    const response = await GetPostbackByIdService(Number(id), {
      accessToken,
      refreshToken,
    });

    return res.status(response.statusCode).json({
      message: response.message,
      data: response.body,
    });
  } catch (error) {
    console.error("Error in GetPostbackByIdController:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

/**
 * Update a postback by ID.
 */
export const UpdatePostbackController = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { body, accessToken, refreshToken } = req;
    const response = await UpdatePostbackService(Number(id), body, {
      accessToken,
      refreshToken,
    });

    return res.status(response.statusCode).json({
      message: response.message,
      data: response.body,
    });
  } catch (error) {
    console.error("Error in UpdatePostbackController:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

/**
 * Delete a postback by ID.
 */
export const DeletePostbackController = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const { accessToken, refreshToken } = req;
    const response = await DeletePostbackService(Number(id), {
      accessToken,
      refreshToken,
    });

    return res.status(response.statusCode).json({
      message: response.message,
      data: response.body,
    });
  } catch (error) {
    console.error("Error in DeletePostbackController:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

/**
 * Get all postbacks by user ID.
 */
export const GetPostbacksByUserIdController = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  const { user, accessToken, refreshToken } = req;

  console.log("User : ", user);

  if (!user?.id) {
    return res.status(400).json({
      ok: false,
      message: "User ID is required",
      statusCode: 400,
    });
  }

  const response = await GetPostbacksByUserIdService(user.id.toString(), {
    accessToken,
    refreshToken,
  });

  return res.status(response.statusCode).json(response);
};
