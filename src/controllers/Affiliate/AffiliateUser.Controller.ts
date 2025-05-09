import { Request, Response, response } from "express";
import { StatusCodes } from "http-status-codes";
import { messages } from "../../utils/consts";
import {
  ChangePasswordService,
  DownloadAffiliateUsersCSVService,
  FetchTopAffiliateUsersService,
  FetchUserReferralsService,
  GetAffiliateUserByIdService,
  GetPaginatedAffiliateUsersService,
  LogoutService,
  ResendOtpCodeService,
  ResendVerificationCodeService,
  SendPasswordChangeOtpService,
  SigninService,
  SignupService,
  VerifyEmailService,
  VerifyOtpService,
  createAffiliateUserActivityService,
  fetchUserById,
  getAffiliateUserActivitiesService,
  refreshTokenService,
  updateUserById,
  deleteAffiliateUserById,
  validateReferralCode,
  restoreAffiliateUserById,
} from "../../services/Affiliate/AffiliateUser.Service";
import { CustomRequest } from "./Affiliate.Controller";
import {
  AffiliateUserSortableFields,
  EActivityType,
  FiltersType,
} from "../../types/Affiliate/Affiliate.types";
import { generateClickMetadata } from "../../utils/Affiliate/helper";

/**
 * Controller to create a new Affiliate User
 *
 * @param {Request} req - The request object containing the user data in the body.
 * @param {Response} res - The response object that will contain the newly created user record or an error message.
 */
export const CreateAffiliateUser = async (req: Request, res: Response) => {
  const data = req.body;
  const userAgent = req.headers["user-agent"] as string;
  const ipAddress = req.ip;

  const response = await SignupService(data, userAgent, ipAddress);
  return res.status(response.statusCode).json(response);
};

/**
 * Controller for User Signin
 *
 * @param {Request} req - The request object containing user email and password in the body.
 * @param {Response} res - The response object that will contain the authentication token or an error message.
 */
export const SigninAffiliateUser = async (req: Request, res: Response) => {
  const userAgent = req.headers["user-agent"] as string;
  const ipAddress = req.ip;

  const { email, password } = req.body;
  const response = await SigninService(email, password, userAgent, ipAddress);
  return res.status(response.statusCode).json(response);
};

/**
 * Controller for User Logout
 *
 * @param {Request} req - The request object containing the user ID and token in the body.
 * @param {Response} res - The response object indicating the success or failure of the logout operation.
 */
export const LogoutAffiliateUser = async (req: Request, res: Response) => {
  const userAgent = req.headers["user-agent"] as string;
  const ipAddress = req.ip;

  const { userId, token } = req.body;
  const response = await LogoutService(userId, token, userAgent, ipAddress);
  return res.status(response.statusCode).json(response);
};

/**
 * Controller for Verifying User Email
 *
 * @param {Request} req - The request object containing user email and verification code in the body.
 * @param {Response} res - The response object indicating the success or failure of the email verification.
 */
export const VerifyEmailAffiliateUser = async (req: Request, res: Response) => {
  const userAgent = req.headers["user-agent"] as string;
  const ipAddress = req.ip;

  const { email, verificationCode } = req.body;
  const response = await VerifyEmailService(
    email,
    verificationCode,
    userAgent,
    ipAddress
  );
  return res.status(response.statusCode).json(response);
};

/**
 * Controller for Verifying User Email
 *
 * @param {Request} req - The request object containing user email and verification code in the body.
 * @param {Response} res - The response object indicating the success or failure of the email verification.
 */
export const VerifyOtpAffiliateUser = async (req: Request, res: Response) => {
  const userAgent = req.headers["user-agent"] as string;
  const ipAddress = req.ip;

  const { email, verificationCode } = req.body;
  const response = await VerifyOtpService(
    email,
    verificationCode,
    userAgent,
    ipAddress
  );
  return res.status(response.statusCode).json(response);
};

/**
 * Controller for resending Verification Code
 *
 * @param {Request} req - The request object containing user email in the body.
 * @param {Response} res - The response object indicating whether the verification code was resent or not.
 */
export const ResendVerificationCodeAffiliateUser = async (
  req: Request,
  res: Response
) => {
  const userAgent = req.headers["user-agent"] as string;
  const ipAddress = req.ip;

  const { email } = req.body;
  const response = await ResendVerificationCodeService(
    email,
    userAgent,
    ipAddress
  );
  return res.status(response.statusCode).json(response);
};
/**
 * Controller for resending Verification Code
 *
 * @param {Request} req - The request object containing user email in the body.
 * @param {Response} res - The response object indicating whether the verification code was resent or not.
 */
export const ResendOtpCodeAffiliateUser = async (
  req: Request,
  res: Response
) => {
  const userAgent = req.headers["user-agent"] as string;
  const ipAddress = req.ip;

  const { email } = req.body;
  const response = await ResendOtpCodeService(email, userAgent, ipAddress);
  return res.status(response.statusCode).json(response);
};

/**
 * Controller for sending OTP for password change
 *
 * @param {Request} req - The request object containing user email in the body.
 * @param {Response} res - The response object indicating whether the OTP was sent or not.
 */
export const SendPasswordChangeOtpAffiliateUser = async (
  req: Request,
  res: Response
) => {
  const userAgent = req.headers["user-agent"] as string;
  const ipAddress = req.ip;

  const { email } = req.body;
  const response = await SendPasswordChangeOtpService(
    email,
    userAgent,
    ipAddress
  );
  return res.status(response.statusCode).json(response);
};

/**
 * Controller for changing User Password
 *
 * @param {Request} req - The request object containing user email, OTP, new password, and confirm password in the body.
 * @param {Response} res - The response object indicating success or failure of the password change.
 */
export const ChangePasswordAffiliateUser = async (
  req: Request,
  res: Response
) => {
  const userAgent = req.headers["user-agent"] as string;
  const ipAddress = req.ip;

  const { email, otp, newPassword, confirmPassword } = req.body;
  const response = await ChangePasswordService(
    email,
    otp,
    newPassword,
    confirmPassword,
    userAgent,
    ipAddress
  );
  return res.status(response.statusCode).json(response);
};

/**
 * Controller for refreshing the access token
 *
 * @param {Request} req - The request object containing the refresh token and access token in the headers.
 * @param {Response} res - The response object indicating success or failure of the token refresh.
 */
export const RefreshTokenController = async (req: Request, res: Response) => {
  const { refreshToken, accessToken } = req.body;

  const response = await refreshTokenService(refreshToken, accessToken);

  return res.status(response.statusCode).json(response);
};

/**
 * Controller to get a paginated list of affiliate users
 *
 * @param {Request} req - The request object containing pagination params `page` and `size` as query parameters.
 * @param {Response} res - The response object with the paginated list of affiliate users or an error message.
 */
export const getPaginatedAffiliateUsers = async (
  req: CustomRequest,
  res: Response
) => {
  const { accessToken, refreshToken } = req;
  const { page = 1, size = 10, filters } = req.query;

  const filtersTyped: FiltersType = {};

  if (filters && typeof filters === "object") {
    if ("active" in filters) {
      filtersTyped.active = filters.active === "true";
    }
    if ("searchQuery" in filters) {
      filtersTyped.searchQuery = filters.searchQuery as string;
    }
    if ("sortBy" in filters) {
      filtersTyped.sortBy = filters.sortBy as AffiliateUserSortableFields;
    }
    if ("sortOrder" in filters) {
      filtersTyped.sortOrder = filters.sortOrder === "ASC" ? "ASC" : "DESC";
    }
    if ("tier_level" in filters) {
      filtersTyped.tier_level = filters.tier_level as unknown as number;
    }
    if ("total_referrals" in filters) {
      filtersTyped.total_referrals = Number(filters.total_referrals);
    }
  }

  const response = await GetPaginatedAffiliateUsersService({
    page: Number(page),
    size: Number(size),
    filters: filtersTyped,
    tokens: {
      accessToken,
      refreshToken,
    },
  });

  return res.status(response.statusCode).json(response);
};

/**
 * Controller to get an affiliate user by ID.
 *
 * @param {Request} req - The request object containing the user ID as a route parameter.
 * @param {Response} res - The response object with the affiliate user details or an error message.
 */
export const getAffiliateUserById = async (
  req: CustomRequest,
  res: Response
) => {
  const { id } = req.params;
  const { accessToken, refreshToken } = req;

  const response = await GetAffiliateUserByIdService(id, {
    accessToken,
    refreshToken,
  });

  return res.status(response.statusCode).json(response);
};

/**
 * Controller to download a CSV file containing affiliate users based on the paginated or filtered query result.
 *
 * @param {Request} req - The request object containing pagination, filtering, and sorting parameters.
 * @param {Response} res - The response object to send the CSV file or an error message.
 */
export const DownloadAffiliateUsersCSV = async (
  req: CustomRequest,
  res: Response
) => {
  const { accessToken, refreshToken } = req;
  const { page = 1, size = 10, filters } = req.query;

  try {
    const filtersTyped: FiltersType = {};

    if (filters && typeof filters === "object") {
      if ("active" in filters) {
        filtersTyped.active = filters.active === "true";
      }
      if ("searchQuery" in filters) {
        filtersTyped.searchQuery = filters.searchQuery as string;
      }
      if ("sortBy" in filters) {
        filtersTyped.sortBy = filters.sortBy as AffiliateUserSortableFields;
      }
      if ("sortOrder" in filters) {
        filtersTyped.sortOrder = filters.sortOrder === "ASC" ? "ASC" : "DESC";
      }
      if ("tier_level" in filters) {
        filtersTyped.tier_level = filters.tier_level as unknown as number;
      }
      if ("total_referrals" in filters) {
        filtersTyped.total_referrals = Number(filters.total_referrals);
      }
    }

    // Fetch CSV data from the service
    const csvResponse = await DownloadAffiliateUsersCSVService({
      page: Number(page),
      size: Number(size),
      filters: filtersTyped,
      tokens: {
        accessToken,
        refreshToken,
      },
    });

    if (!csvResponse.ok) {
      return res.status(csvResponse.statusCode).json(csvResponse);
    }

    // Set headers to prompt file download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=affiliate_users.csv"
    );

    // Send the CSV content
    return res.status(StatusCodes.OK).send(csvResponse);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      body: null,
    });
  }
};

/**
 * Controller to fetch paginated referrals for a user by user ID.
 *
 * @param {Request} req - The request object containing the userId, page, size, and tokens.
 * @param {Response} res - The response object to send the result or an error message.
 */
export const GetUserReferralsController = async (
  req: CustomRequest,
  res: Response
) => {
  const { userId } = req.params;
  const { page = 1, size = 10 } = req.query;
  const { accessToken, refreshToken } = req;

  const response = await FetchUserReferralsService(
    userId,
    Number(page),
    Number(size),
    { accessToken, refreshToken }
  );

  return res.status(response.statusCode).json(response);
};

/**
 * Controller to handle referral code validation requests.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
export const validateReferralCodeController = async (
  req: Request,
  res: Response
) => {
  const { referralCode } = req.params;

  if (!referralCode) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      ok: false,
      message: "Referral code is required.",
      body: false,
    });
  }

  const validationResponse = await validateReferralCode(referralCode);

  return res.status(validationResponse.statusCode).json(validationResponse);
};

/**
 * Controller to fetch a user by ID.
 *
 * @param {CustomRequest} req - The request object containing the userId parameter.
 * @param {Response} res - The response object to send the result or an error message.
 */
export const FetchUserByIdController = async (
  req: CustomRequest,
  res: Response
) => {
  const { user } = req;

  const response = await fetchUserById(user?.id as string);

  return res.status(response.statusCode).json(response);
};

/**
 * Controller to update user information by ID.
 *
 * @param {CustomRequest} req - The request object containing the userId parameter and update data in the body.
 * @param {Response} res - The response object to send the result or an error message.
 */
export const UpdateUserByIdController = async (
  req: CustomRequest,
  res: Response
) => {
  const { user } = req;
  const updateData = req.body;

  const response = await updateUserById(user?.id as string, updateData);

  return res.status(response.statusCode).json(response);
};

/**
 * Controller to delete a user by ID.
 *
 * @param {CustomRequest} req - The request object containing the userId parameters and user access tokens.
 * @param {Response} res - The response object to send the result or an error message.
 */
export const DeleteUserByIdController = async (
  req: CustomRequest,
  res: Response
) => {
  const { user } = req;

  const response = await deleteAffiliateUserById(user?.id as string);

  return res.status(response.statusCode).json(response);
};

/**
 * Controller to restore a user deleted account by ID.
 *
 * @param {CustomRequest} req - The request object containing the userId parameters and user access tokens.
 * @param {Response} res - The response object to send the result or an error message.
 */
export const RestoreUserAccountByIdController = async (
  req: CustomRequest,
  res: Response
) => {
  const { id } = req.params;

  const response = await restoreAffiliateUserById(id!);

  return res.status(response.statusCode).json(response);
};

/**
 * Controller to create an affiliate user activity.
 *
 * @param {CustomRequest} req - The request object containing the activity data in the body.
 * @param {Response} res - The response object to send the result or an error message.
 */
export const CreateAffiliateUserActivityController = async (
  req: CustomRequest,
  res: Response
) => {
  const { activityType } = req.body;
  const { user } = req;
  const userAgent = req.headers["user-agent"] as string;
  const ipAddress = req.ip;

  const metadata = await generateClickMetadata(userAgent, ipAddress);

  const response = await createAffiliateUserActivityService({
    userId: user?.id,
    metadata,
    activityType: activityType as EActivityType,
    performedAt: new Date(),
  });

  return res.status(response.statusCode).json(response);
};

/**
 * Controller to retrieve affiliate user activities with filters.
 *
 * @param {CustomRequest} req - The request object containing filter parameters and pagination options.
 * @param {Response} res - The response object to send the result or an error message.
 */
export const GetAffiliateUserActivitiesController = async (
  req: CustomRequest,
  res: Response
) => {
  const { activityType, startDate, endDate } = req.query;
  const { page = 1, limit = 10 } = req.query;
  const { user } = req;

  const response = await getAffiliateUserActivitiesService(
    {
      userId: user?.id as string,
      activityType: activityType as EActivityType,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
    },
    Number(limit),
    Number(page)
  );

  return res.status(response.statusCode).json(response);
};

/**
 * Controller for fetching the top 10 affiliates based on tier level and total referrals.
 */
export const FetchTopAffiliateUsersController = async (
  req: CustomRequest,
  res: Response
): Promise<Response> => {
  const { accessToken, refreshToken } = req;
  const tokens = {
    accessToken,
    refreshToken,
  };

  // Call the service to fetch the top 10 affiliates
  const result = await FetchTopAffiliateUsersService(tokens);

  return res.status(result.statusCode).json(result);
};
