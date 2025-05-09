import {
  AffiliateUserQuery,
  EActivityType,
  IReferralData,
  PaginatedServiceResponse,
  ServiceResponse,
  TMetaData,
} from "../../types/Affiliate/Affiliate.types";
import { messages } from "../../utils/consts";
import { StatusCodes } from "http-status-codes";
import {
  hashPassword,
  generateOtp,
  comparePasswords,
  generateClickMetadata,
  isSequelizeUniqueConstraintError,
  isSequelizeDatabaseError,
} from "../../utils/Affiliate/helper";
import {
  sendOtpEmail,
  sendVerificationEmail,
} from "../../utils/Affiliate/emailService";
import { AffiliateUser } from "../../models/Affiliate/AffiliateUser.Model";
import { AffiliateUserToken } from "../../models/Affiliate/AffiliateUserToken.Model";
import { isSequelizeValidationError } from "../../utils/validations/AffiliateErrorFunction";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../../utils/Affiliate/jwt";
import { generateRandomReferralId } from "../../utils/Affiliate/generateReferralId";
import { User } from "../../models/User";
import { Op } from "sequelize";
import * as fastcsv from "fast-csv";
import { Readable } from "stream";
import { AffiliateUserActivity } from "../../models/Affiliate/AffiliateActivities.Model";
import { log } from "../../utils/logger";

/**
 * Create a new Affiliate User in the database.
 * @param {Partial<Omit<AffiliateUser, "password">>} data - The User information to create a new Affiliate User record with.
 * @returns {Promise<ServiceResponse<{userInfo: Partial<Omit<AffiliateUser, "password">>, metadata: TMetaData;}>>} - A response object containing the status of the operations and the records created.
 */
export const SignupService = async (
  data: Partial<AffiliateUser>,
  userAgent?: string,
  ipAddress?: string
): Promise<
  ServiceResponse<{
    userInfo: Partial<Omit<AffiliateUser, "password">>;
    metadata: TMetaData;
  }>
> => {
  const referralCode = generateRandomReferralId();

  try {
    // Check if the user with the same email already exists
    const existingUser = await AffiliateUser.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      return {
        ok: false,
        message: messages.USER_ALREADY_EXIST,
        statusCode: StatusCodes.CONFLICT,
        body: null,
      };
    }

    // Validate referral code, if provided
    if (data.referral_code) {
      const validAffiliateUser = await AffiliateUser.findOne({
        where: { referral_code: data.referral_code },
      });

      if (!validAffiliateUser) {
        return {
          ok: false,
          message: messages.INVALID_REFERRAL_CODE,
          statusCode: StatusCodes.BAD_REQUEST,
          body: null,
        };
      }
    }

    const passwordHash = await hashPassword(data.password!);
    const verificationCode = generateOtp();

    // Attempt to send the verification email
    try {
      await sendVerificationEmail(data.email!, verificationCode);
    } catch (error) {
      return {
        ok: false,
        message: `${messages.EMAIL_SEND_FAILURE} ${(error as Error).message}`,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: null,
      };
    }

    const metadata = await generateClickMetadata(userAgent!, ipAddress!);

    // Create the user
    const userInfo = await AffiliateUser.create({
      ...data,
      password: passwordHash,
      verification_code: verificationCode,
      verification_type: "email_verification",
      referral_code: referralCode,
      referred_by: data.referral_code ?? null,
    });

    const {
      password,
      verification_code,
      verification_type,
      ...filteredUserInfo
    } = userInfo.toJSON();

    try {
      await createAffiliateUserActivityService({
        userId: filteredUserInfo.id,
        metadata,
        activityType: EActivityType.SIGN_UP,
        performedAt: new Date(),
      });
    } catch (activityError) {
      return {
        ok: false,
        message: messages.SIGNUP_FAILED,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: null,
      };
    }

    return {
      ok: true,
      message: messages.SIGNUP_SUCCESS,
      statusCode: StatusCodes.CREATED,
      body: { userInfo: filteredUserInfo, metadata },
    };
  } catch (error) {
    // Handle validation errors
    log("error", error);
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
      message: messages.SIGNUP_FAILED,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
};

/**
 * Log the user in using their email and password.
 * @param {string} email - The email of the user trying to log in.
 * @param {string} password - The password of the user trying to log in.
 * @returns {Promise<ServiceResponse<{ user: AffiliateUser, accessToken: string; refreshToken: string }>>} - A promise that resolves to a service response containing
 * the status of the operation, a message, and the generated access and refresh token if successful.
 */
export const SigninService = async (
  email: string,
  password: string,
  userAgent?: string,
  ipAddress?: string
): Promise<
  ServiceResponse<{
    user: Partial<AffiliateUser>;
    accessToken: string;
    refreshToken: string;
  }>
> => {
  try {
    // Check if the user exists
    const user = await AffiliateUser.findOne({
      where: { email },
    });

    if (!user) {
      return {
        ok: false,
        message: messages.USER_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
      };
    }

    // Verify account status
    if (!user.is_verified) {
      const currentTime = new Date();
      const updatedAtTime = new Date(user.updated_at);
      const tokenExpired =
        currentTime.getTime() - updatedAtTime.getTime() > 2 * 60 * 1000;

      if (tokenExpired) {
        const newVerificationCode = generateOtp();
        user.verification_code = newVerificationCode;
        user.verification_type = "email_verification";
        await user.save();
        await sendVerificationEmail(user.email, newVerificationCode);

        return {
          ok: false,
          message: messages.VERIFICATION_CODE_EXPIRED,
          statusCode: StatusCodes.FORBIDDEN,
          body: null,
        };
      }

      return {
        ok: false,
        message: messages.ACCOUNT_NOT_VERIFIED,
        statusCode: StatusCodes.FORBIDDEN,
        body: null,
      };
    }

    // Validate password
    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      return {
        ok: false,
        message: messages.INVALID_CREDENTIALS,
        statusCode: StatusCodes.UNAUTHORIZED,
        body: null,
      };
    }

    // Invalidate old tokens
    await AffiliateUserToken.update(
      { is_active: false },
      { where: { userId: user.id, is_active: true } }
    );

    // Generate tokens
    const refreshToken = generateRefreshToken(user);
    const refreshTokenObj = await AffiliateUserToken.create({
      userId: user.id,
      token: refreshToken,
      is_active: true,
    });

    const accessToken = generateAccessToken(user, refreshTokenObj.id);

    user.updated_at = new Date();
    user.last_login = new Date();

    const metadata = await generateClickMetadata(userAgent!, ipAddress!);

    const {
      password: _,
      verification_code,
      verification_type,
      ...filteredUserInfo
    } = user.toJSON();

    try {
      await createAffiliateUserActivityService({
        userId: user.id,
        metadata,
        activityType: EActivityType.SIGN_IN,
        performedAt: new Date(),
      });
    } catch (activityError) {
      return {
        ok: false,
        message: messages.SIGNIN_FAILED,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: null,
      };
    }

    return {
      ok: true,
      message: messages.SIGNIN_SUCCESS,
      statusCode: StatusCodes.OK,
      body: { user: filteredUserInfo, accessToken, refreshToken },
    };
  } catch (error) {
    // Handle validation errors
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
      message: messages.SIGNIN_FAILED,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
};

/**
 * Log the user out and revoke the token.
 * @param {number} userId - The ID of the user to log out.
 * @param {string} token - The token to revoke.
 * @returns {Promise<ServiceResponse<object>>} - A response indicating the success of the logout operation.
 */
export const LogoutService = async (
  userId: string,
  token: string,
  userAgent?: string,
  ipAddress?: string
): Promise<ServiceResponse<object>> => {
  try {
    const deletedCount = await AffiliateUserToken.destroy({
      where: { userId, token },
    });

    if (deletedCount === 0) {
      return {
        ok: false,
        message: "Token not found.",
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
      };
    }

    const metadata = await generateClickMetadata(userAgent!, ipAddress!);

    try {
      await createAffiliateUserActivityService({
        userId,
        metadata,
        activityType: EActivityType.LOGOUT,
        performedAt: new Date(),
      });
    } catch (error) {
      console.error("Error logging logout activity:", error);
    }

    return {
      ok: true,
      message: messages.LOGOUT_SUCCESS,
      statusCode: StatusCodes.OK,
      body: null,
    };
  } catch (error) {
    console.error("Logout error:", error);

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
      message: messages.LOGOUT_FAILED,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
};

/**
 * Verify the user's OTP by matching the verification code.
 * @param {string} email - The email address of the user.
 * @param {string} verificationCode - The verification code sent to the user's email.
 * @returns {Promise<ServiceResponse<null>>} - A response indicating the success or failure of the otp verification.
 */
export const VerifyOtpService = async (
  email: string,
  verificationCode: string,
  userAgent?: string,
  ipAddress?: string
): Promise<ServiceResponse<null>> => {
  try {
    const user = await AffiliateUser.findOne({
      where: {
        email,
        verification_code: verificationCode,
        verification_type: "password_reset",
      },
    });

    if (!user) {
      return {
        ok: false,
        message: messages.INVALID_OTP,
        statusCode: StatusCodes.BAD_REQUEST,
        body: null,
      };
    }

    user.verification_code = null;
    user.verification_type = null;
    user.is_verified = true;
    await user.save();

    const metadata = await generateClickMetadata(userAgent!, ipAddress!);

    try {
      await createAffiliateUserActivityService({
        userId: user.id,
        metadata,
        activityType: EActivityType.ACCOUNT_VERIFICATION,
        performedAt: new Date(),
      });
    } catch (error) {
      console.error("Error logging OTP verification:", error);
    }

    return {
      ok: true,
      message: messages.OTP_VERIFIED,
      statusCode: StatusCodes.OK,
      body: null,
    };
  } catch (error) {
    console.error("Verify OTP error:", error);

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
 * Verify the user's email by matching the verification code.
 * @param {string} email - The email address of the user.
 * @param {string} verificationCode - The verification code sent to the user's email.
 * @returns {Promise<ServiceResponse<AffiliateUser>>} - A response indicating the success or failure of the email verification.
 */
export const VerifyEmailService = async (
  email: string,
  verificationCode: string,
  userAgent?: string,
  ipAddress?: string
): Promise<ServiceResponse<AffiliateUser>> => {
  try {
    const user = await AffiliateUser.findOne({
      where: {
        email,
        verification_code: verificationCode,
        verification_type: "email_verification",
      },
    });

    if (!user) {
      return {
        ok: false,
        message: messages.INVALID_VERIFICATION_CODE,
        statusCode: StatusCodes.BAD_REQUEST,
        body: null,
      };
    }

    // Clear the verification code after successful verification
    user.verification_code = null;
    user.verification_type = null;
    user.is_verified = true;
    await user.save();

    return {
      ok: true,
      message: messages.EMAIL_VERIFIED,
      statusCode: StatusCodes.OK,
      body: null,
    };
  } catch (error) {
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
 * Resend the verification code to the user's email if the current code is expired.
 * @param {string} email - The email address of the user.
 * @returns {Promise<ServiceResponse<string>>} - A response indicating whether the code was resent or not.
 */
export const ResendVerificationCodeService = async (
  email: string,
  userAgent?: string,
  ipAddress?: string
): Promise<ServiceResponse<string>> => {
  try {
    const user = await AffiliateUser.findOne({ where: { email } });

    if (!user) {
      return {
        ok: false,
        message: messages.USER_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
      };
    }

    // Check if the user is already verified
    if (user.is_verified) {
      return {
        ok: false,
        message: messages.ACCOUNT_ALREADY_VERIFIED,
        statusCode: StatusCodes.BAD_REQUEST,
        body: null,
      };
    }

    // Check if the verification code has expired (2 minutes since updatedAt)
    const currentTime = new Date();
    const updatedAtTime = new Date(user.updated_at);
    const tokenExpired =
      currentTime.getTime() - updatedAtTime.getTime() > 2 * 60 * 1000;

    if (tokenExpired) {
      // Generate a new verification code and update the updatedAt timestamp
      const newVerificationCode = generateOtp();
      user.verification_code = newVerificationCode;
      user.verification_type = "email_verification";
      user.updated_at = new Date();
      await user.save();

      // Send the new verification code
      await sendVerificationEmail(user.email, newVerificationCode);

      return {
        ok: true,
        message: messages.VERIFICATION_CODE_RESENT,
        statusCode: StatusCodes.OK,
        body: null,
      };
    } else {
      // The current verification code is still valid
      return {
        ok: false,
        message: messages.VERIFICATION_CODE_STILL_VALID,
        statusCode: StatusCodes.BAD_REQUEST,
        body: null,
      };
    }
  } catch (error) {
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
 * Resend the verification code to the user's email if the current code is expired.
 * @param {string} email - The email address of the user.
 * @returns {Promise<ServiceResponse<string>>} - A response indicating whether the code was resent or not.
 */
export const ResendOtpCodeService = async (
  email: string,
  userAgent?: string,
  ipAddress?: string
): Promise<ServiceResponse<string>> => {
  try {
    const user = await AffiliateUser.findOne({ where: { email } });

    if (!user) {
      return {
        ok: false,
        message: messages.USER_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
      };
    }

    // Check if the verification code has expired (1 minutes since updatedAt)
    const currentTime = new Date();
    const updatedAtTime = new Date(user.updated_at);
    const tokenExpired =
      currentTime.getTime() - updatedAtTime.getTime() > 1 * 60 * 1000;

    if (tokenExpired) {
      // Generate a new verification code and update the updatedAt timestamp
      const newVerificationCode = generateOtp();
      user.verification_code = newVerificationCode;
      user.verification_type = "password_reset";
      user.updated_at = new Date();
      await user.save();

      // Send the new verification code
      await sendOtpEmail(user.email, newVerificationCode);

      return {
        ok: true,
        message: messages.OTP_RESENT,
        statusCode: StatusCodes.OK,
        body: null,
      };
    } else {
      // The current verification code is still valid
      return {
        ok: false,
        message: messages.OTP_STILL_VALID,
        statusCode: StatusCodes.BAD_REQUEST,
        body: null,
      };
    }
  } catch (error) {
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
 * Send an OTP for password change, checking if the previous OTP is expired.
 * @param {string} email - The email of the user requesting the OTP.
 * @returns {Promise<ServiceResponse<null>>} - A service response indicating whether the OTP was sent.
 */
export const SendPasswordChangeOtpService = async (
  email: string,
  userAgent?: string,
  ipAddress?: string
): Promise<ServiceResponse<null>> => {
  try {
    const user = await AffiliateUser.findOne({ where: { email } });

    if (!user) {
      return {
        ok: false,
        message: messages.USER_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
      };
    }

    // Check if OTP already exists and if it's expired (1 minutes)
    if (user.verification_code && user.verification_type === "password_reset") {
      const currentTime = new Date();
      const updatedAtTime = new Date(user.updated_at);
      const otpExpired =
        currentTime.getTime() - updatedAtTime.getTime() > 1 * 60 * 1000;

      if (!otpExpired) {
        return {
          ok: false,
          message: messages.OTP_STILL_VALID,
          statusCode: StatusCodes.BAD_REQUEST,
          body: null,
        };
      }
    }

    // OTP is either expired or doesn't exist, generate a new one
    const otp = generateOtp();
    user.verification_code = otp;
    user.verification_type = "password_reset";
    user.updated_at = new Date();
    await user.save();

    // Send the OTP to the user's email
    await sendOtpEmail(user.email, otp);

    return {
      ok: true,
      message: messages.OTP_SENT,
      statusCode: StatusCodes.OK,
      body: null,
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
 * Change the user's password using a valid OTP, new password, and confirm password.
 * @param {string} email - The email address of the user.
 * @param {string} otp - The OTP provided by the user.
 * @param {string} newPassword - The new password to be set.
 * @param {string} confirmPassword - The confirmation of the new password.
 * @returns {Promise<ServiceResponse<AffiliateUser>>} - A response indicating success or failure of the password change.
 */
export const ChangePasswordService = async (
  email: string,
  otp: string,
  newPassword: string,
  confirmPassword: string,
  userAgent?: string,
  ipAddress?: string
): Promise<ServiceResponse<AffiliateUser>> => {
  try {
    const user = await AffiliateUser.findOne({
      where: {
        email,
        verification_code: otp,
        verification_type: "password_reset",
      },
    });

    if (!user) {
      return {
        ok: false,
        message: messages.INVALID_OTP,
        statusCode: StatusCodes.BAD_REQUEST,
        body: null,
      };
    }

    // Check if the OTP has expired (1 minutes since updatedAt)
    const currentTime = new Date();
    const updatedAtTime = new Date(user.updated_at);
    const otpExpired =
      currentTime.getTime() - updatedAtTime.getTime() > 1 * 60 * 1000;

    const metadata = await generateClickMetadata(userAgent!, ipAddress!);

    if (otpExpired) {
      return {
        ok: false,
        message: messages.OTP_EXPIRED,
        statusCode: StatusCodes.BAD_REQUEST,
        body: null,
      };
    }

    // Check if newPassword and confirmPassword match
    if (newPassword !== confirmPassword) {
      return {
        ok: false,
        message: messages.PASSWORDS_DO_NOT_MATCH,
        statusCode: StatusCodes.BAD_REQUEST,
        body: null,
      };
    }

    // Hash the new password and update the user's record
    const newPasswordHash = await hashPassword(newPassword);
    user.password = newPasswordHash;

    // Clear the verification code after successful password change
    user.verification_code = null;
    user.verification_type = null;
    await user.save();

    try {
      await createAffiliateUserActivityService({
        userId: user.id,
        metadata,
        activityType: EActivityType.PASSWORD_CHANGE,
        performedAt: new Date(),
      });
    } catch (error) {
      console.error("Error logging OTP verification:", error);
    }

    return {
      ok: true,
      message: messages.PASSWORD_CHANGE_SUCCESS,
      statusCode: StatusCodes.OK,
      body: user,
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
 * Refresh the access token service.
 * Deletes the old refresh token, deletes inactive tokens, and generates a new one.
 * @param {string} refreshToken - The refresh token to verify.
 * @param {string} accessToken - The access token to verify.
 * @returns {Promise<ServiceResponse<{ accessToken: string; refreshToken: string }>>} - A service response containing new tokens or an error message.
 */
export const refreshTokenService = async (
  refreshToken: string,
  accessToken: string
): Promise<ServiceResponse<{ accessToken: string; refreshToken: string }>> => {
  // Validate refresh token
  const decodedRefreshToken = verifyToken(refreshToken);
  if (typeof decodedRefreshToken === "string") {
    return {
      ok: false,
      message: messages.INVALID_REFRESH_TOKEN,
      statusCode: StatusCodes.FORBIDDEN,
      body: null,
    };
  }
  if (!decodedRefreshToken || decodedRefreshToken.type !== "refresh") {
    return {
      ok: false,
      message: messages.INVALID_REFRESH_TOKEN,
      statusCode: StatusCodes.FORBIDDEN,
      body: null,
    };
  }

  // Check if the refresh token exists and is active
  const oldRefreshTokenObj = await AffiliateUserToken.findOne({
    where: { token: refreshToken },
  });

  // If the refresh token is not found or is inactive
  if (!oldRefreshTokenObj) {
    return {
      ok: false,
      message: messages.REFRESH_TOKEN_NOT_FOUND,
      statusCode: StatusCodes.UNAUTHORIZED,
      body: null,
    };
  }

  if (!oldRefreshTokenObj.is_active) {
    // If the refresh token is inactive, delete it from the database
    await AffiliateUserToken.destroy({
      where: { id: oldRefreshTokenObj.id },
    });

    return {
      ok: false,
      message: messages.INVALID_REFRESH_TOKEN,
      statusCode: StatusCodes.UNAUTHORIZED,
      body: null,
    };
  }

  // Retrieve the user associated with the refresh token
  const user = await AffiliateUser.findByPk(oldRefreshTokenObj.userId);
  if (!user) {
    return {
      ok: false,
      message: messages.USER_NOT_FOUND,
      statusCode: StatusCodes.NOT_FOUND,
      body: null,
    };
  }

  // Validate access token
  const decodedAccessToken = verifyToken(accessToken);

  // Check if access token is expired
  if (typeof decodedAccessToken === "string") {
    // Check if 'sub' is defined
    if (!decodedRefreshToken.sub) {
      return {
        ok: false,
        message: messages.INVALID_REFRESH_TOKEN,
        statusCode: StatusCodes.FORBIDDEN,
        body: null,
      };
    }

    const userId = decodedRefreshToken.sub.split("-")[1];
    const foundUser = await AffiliateUser.findByPk(userId);
    if (!foundUser) {
      return {
        ok: false,
        message: messages.USER_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
      };
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(
      foundUser,
      oldRefreshTokenObj.id
    );

    return {
      ok: true,
      message: messages.TOKEN_REFRESH_SUCCESS,
      statusCode: StatusCodes.OK,
      body: { accessToken: newAccessToken, refreshToken: refreshToken },
    };
  }

  // If the access token is valid, no need to refresh
  if (!decodedAccessToken || decodedAccessToken.type !== "access") {
    return {
      ok: false,
      message: messages.INVALID_ACCESS_TOKEN,
      statusCode: StatusCodes.FORBIDDEN,
      body: null,
    };
  }

  // Invalidate the old refresh token (deactivate it)
  await AffiliateUserToken.update(
    { is_active: false },
    { where: { id: oldRefreshTokenObj.id } }
  );

  // Clean up inactive tokens for the user
  await AffiliateUserToken.destroy({
    where: {
      userId: user.id,
      is_active: false,
    },
  });

  // Generate new refresh token and store it
  const newRefreshToken = generateRefreshToken(user);
  const newRefreshTokenObj = await AffiliateUserToken.create({
    userId: user.id,
    token: newRefreshToken,
    is_active: true,
  });

  // Generate new access token
  const newAccessToken = generateAccessToken(user, newRefreshTokenObj.id);

  return {
    ok: true,
    message: messages.TOKEN_REFRESH_SUCCESS,
    statusCode: StatusCodes.OK,
    body: { accessToken: newAccessToken, refreshToken: newRefreshToken },
  };
};

/**
 * Fetch a paginated list of affiliate users from the database with optional filtering and sorting.
 *
 * @param {AffiliateUserQuery} query - An object containing pagination, filtering, and sorting criteria.
 * @param {number} query.page - The page number to retrieve (1-based index).
 * @param {number} query.size - The number of records to retrieve per page.
 * @param {Object} [query.filters] - An optional object for filtering the results.
 * @param {boolean} [query.filters.active] - Filter by active (true) or inactive (false) status.
 * @param {string} [query.filters.searchQuery] - Search term to filter results across multiple fields.
 * @param {string} [query.filters.sortBy] - The field by which to sort the results (e.g., 'full_name', 'email').
 * @param {string} [query.filters.sortOrder] - The order to sort the results; either 'ASC' or 'DESC'.
 * @param {string} [query.filters.tier_level] - Filter results by tier level.
 * @param {number} [query.filters.total_referrals] - Filter results by total referrals (greater than or equal to).
 * @param {Object} [query.tokens] - Optional tokens for authentication.
 * @param {string} [query.tokens.accessToken] - Access token for authentication.
 * @param {string} [query.tokens.refreshToken] - Refresh token for authentication.
 *
 * @return {Promise<PaginatedServiceResponse<AffiliateUser>>} - A response object containing the paginated list of affiliate users, total count, and pagination details.
 */
export const GetPaginatedAffiliateUsersService = async (
  query: AffiliateUserQuery
): Promise<PaginatedServiceResponse<AffiliateUser>> => {
  const { page, size, filters = {}, tokens = {} } = query;

  const {
    active,
    searchQuery,
    sortBy,
    sortOrder,
    tier_level,
    total_referrals,
  } = filters;
  const { accessToken, refreshToken } = tokens;

  try {
    // Validate page and size for pagination
    if (page < 1 || size < 1) {
      return {
        ok: false,
        message: messages.INVALID_PAGINATION,
        statusCode: StatusCodes.BAD_REQUEST,
        body: null,
      };
    }

    // Calculate the offset for pagination
    const offset = (page - 1) * size;

    // Prepare the where clause for filtering
    const whereClause: any = {};

    // Filtering by active/inactive status
    if (active !== undefined) {
      whereClause.is_active = active;
    }

    // Filtering by tier level
    if (tier_level !== undefined) {
      whereClause.tier_level = tier_level;
    }

    // Filtering by total referrals
    if (total_referrals !== undefined) {
      whereClause.total_referrals = {
        [Op.gte]: total_referrals,
      };
    }

    // Searching by multiple fields
    if (searchQuery) {
      whereClause[Op.or] = [
        { id: { [Op.eq]: searchQuery } },
        { full_name: { [Op.iLike]: `%${searchQuery}%` } },
        { email: { [Op.iLike]: `%${searchQuery}%` } },
        { is_verified: { [Op.iLike]: `%${searchQuery}%` } },
        { referral_code: { [Op.iLike]: `%${searchQuery}%` } },
        { referral_code: { [Op.iLike]: `%${searchQuery}%` } },
        { last_login: { [Op.iLike]: `%${searchQuery}%` } },
        { tier_level: { [Op.eq]: searchQuery } },
        { total_referrals: { [Op.eq]: searchQuery } },
        { country: { [Op.iLike]: `%${searchQuery}%` } },
        { phone_number: { [Op.iLike]: `%${searchQuery}%` } },
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
    const { count: totalCount, rows: items } =
      await AffiliateUser.findAndCountAll({
        where: whereClause,
        offset,
        limit: size,
        order,
      });

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
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  } catch (error) {
    // Handle Sequelize errors
    if (error instanceof Error) {
      return {
        ok: false,
        message: `Failed to fetch paginated affiliate users: ${error.message}`,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: null,
      };
    }

    // Fallback for unknown errors
    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
};

/**
 * Fetch an affiliate user by its ID from the database.
 *
 * @param {string} id - The ID of the affiliate user to retrieve.
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @param {string} [tokens.accessToken] - Access token for authentication.
 * @param {string} [tokens.refreshToken] - Refresh token for authentication.
 * @returns {Promise<ServiceResponse<AffiliateUser>>} - A response object containing the affiliate user data if found.
 */
export const GetAffiliateUserByIdService = async (
  id: string,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<AffiliateUser>> => {
  try {
    const affiliateUser = await AffiliateUser.findByPk(id);

    if (!affiliateUser) {
      return {
        ok: false,
        message: messages.NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
      };
    }

    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.OK,
      body: affiliateUser,
      tokens,
    };
  } catch (error) {
    // Handle Sequelize error
    if (error instanceof Error) {
      return {
        ok: false,
        message: `Failed to fetch affiliate user: ${error.message}`,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: null,
      };
    }

    // Fallback for unknown errors
    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
};

/**
 * Download affiliate users in CSV format based on the paginated or query result.
 *
 * @param {AffiliateUserQuery} query - The query object for filtering, sorting, and pagination.
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @param {string} [tokens.accessToken] - Access token for authentication.
 * @param {string} [tokens.refreshToken] - Refresh token for authentication.
 * @returns {Promise<ServiceResponse<string>>} - A response containing the CSV data or an error message.
 */
export const DownloadAffiliateUsersCSVService = async (
  query: AffiliateUserQuery,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<string>> => {
  try {
    const paginatedResult = await GetPaginatedAffiliateUsersService(query);

    // Check if the result was not OK or body is null
    if (!paginatedResult.ok || !paginatedResult.body) {
      return {
        ok: false,
        message: paginatedResult.message || "Failed to retrieve data",
        statusCode: paginatedResult.statusCode || 500,
        body: null,
      };
    }

    // Extract the affiliate users from the result
    const affiliateUsers = paginatedResult.body.items;

    // Fields for the CSV
    const fields: (keyof AffiliateUser)[] = [
      "id",
      "full_name",
      "email",
      "referral_code",
      "is_active",
      "is_verified",
      "tier_level",
      "total_referrals",
      "referral_code",
      "country",
      "date_of_birth",
      "phone_number",
      "created_at",
      "updated_at",
    ];

    // Create a readable stream from affiliateUsers array
    const csvStream = fastcsv.format({ headers: fields });
    const readable = new Readable({
      read() {
        affiliateUsers.forEach((user) => {
          // Map over known fields and access their values from the user object
          const userRow = fields.map((field) => user[field]);

          // Convert the array to a CSV row which is a string
          const csvRow = userRow.join(",") + "\n";

          // Push the string (CSV row) to the readable stream
          readable.push(csvRow);
        });

        this.push(null);
      },
    });

    let csvData = "";
    csvStream.on("data", (chunk) => {
      csvData += chunk.toString();
    });

    // Pipe the formatted data to csvStream
    readable.pipe(csvStream);

    return new Promise((resolve, reject) => {
      csvStream.on("end", () => {
        resolve({
          ok: true,
          message: "CSV file generated successfully",
          statusCode: 200,
          body: csvData,
        });
      });

      csvStream.on("error", (err) => {
        reject({
          ok: false,
          message: `Failed to generate CSV: ${err.message}`,
          statusCode: 500,
          body: null,
          tokens,
        });
      });
    });
  } catch (error) {
    if (error instanceof Error) {
      return {
        ok: false,
        message: `Failed to generate CSV: ${error.message}`,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: null,
      };
    }

    // Fallback for unknown errors
    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
};

/**
 * Fetch paginated referrals for a user by user ID, sorted by registration date regardless of user type.
 *
 * @param userId - The ID of the user to fetch referrals for.
 * @param page - The page number to retrieve (1-based index).
 * @param size - The number of records to retrieve per page.
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @param {string} [tokens.accessToken] - Access token for authentication.
 * @param {string} [tokens.refreshToken] - Refresh token for authentication.
 * @returns A ServiceResponse containing the list of referrals and pagination info.
 */
export const FetchUserReferralsService = async (
  userId: string,
  page: number,
  size: number,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<
  ServiceResponse<{
    referrals: IReferralData[];
    total_count: number;
    total_pages: number;
    tokens?: { accessToken?: string; refreshToken?: string };
  }>
> => {
  try {
    const offset = (page - 1) * size;

    // Find total counts for referrals from AffiliateUser model
    const totalAffiliateReferrals = await AffiliateUser.count({
      where: { referral_code: userId },
    });

    // Find total counts for referrals from User model
    const totalTraderReferrals = await User.count({
      where: { referral_code: userId },
    });

    // Calculate total referrals
    const totalCount = totalAffiliateReferrals + totalTraderReferrals;
    const totalPages = Math.ceil(totalCount / size);

    // Fetch all Affiliate referrals
    const affiliateReferrals = await AffiliateUser.findAll({
      where: { referral_code: userId },
      include: [
        {
          model: User,
          attributes: ["id", "full_name", "email", "is_verified", "created_at"],
        },
      ],
    });

    // Fetch all Trader referrals
    const traderReferrals = await User.findAll({
      where: { referral_code: userId },
      attributes: ["id", "full_name", "email", "is_verified", "created_at"],
    });

    // Combine results into one array
    const referrals: IReferralData[] = [];

    // Process Affiliate referrals
    affiliateReferrals.forEach((referral) => {
      referrals.push({
        id: referral.id,
        full_name: referral.full_name,
        email: referral.email,
        verification_status: referral.is_verified,
        userType: "Affiliate",
        registration_date: referral.created_at,
        referred_count: referral.total_referrals || 0,
      });
    });

    // Process Trader referrals
    traderReferrals.forEach((referral) => {
      referrals.push({
        id: referral.id,
        full_name: referral.first_name + " " + referral.last_name,
        email: referral.email,
        verification_status: referral.is_email_verified,
        userType: "Trader",
        registration_date: referral.created_at,
        referred_count: 0,
      });
    });

    // Sort referrals by registration date
    referrals.sort((a, b) =>
      a.registration_date > b.registration_date ? 1 : -1
    );

    // Manual pagination
    const paginatedReferrals = referrals.slice(offset, offset + size);

    return {
      ok: true,
      statusCode: StatusCodes.OK,
      message: messages.OK,
      body: {
        referrals: paginatedReferrals,
        total_count: totalCount,
        total_pages: totalPages,
      },
      tokens,
    };
  } catch (error) {
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
 * Validate a referral code.
 * @param {string} referralCode - The referral code to validate.
 * @returns {Promise<ServiceResponse<boolean>>} - A response object containing the status of the operation and whether the code is valid.
 */
export const validateReferralCode = async (
  referralCode: string
): Promise<ServiceResponse<boolean>> => {
  try {
    const validAffiliateUser = await AffiliateUser.findOne({
      where: { referral_code: referralCode },
    });

    const validUser = validAffiliateUser
      ? null
      : await User.findOne({
          where: { referral_code: referralCode },
        });

    if (!validAffiliateUser && !validUser) {
      return {
        ok: false,
        message: "Invalid referral code.",
        statusCode: StatusCodes.BAD_REQUEST,
        body: false,
      };
    }

    return {
      ok: true,
      message: "Referral ID is valid.",
      statusCode: StatusCodes.OK,
      body: true,
    };
  } catch (error) {
    return {
      ok: false,
      message: "Failed to validate referral code.",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: false,
    };
  }
};

/**
 * Fetch a user by ID, excluding the password field.
 * @param {number} userId - The ID of the user to fetch.
 * @returns {Promise<ServiceResponse<Partial<Omit<AffiliateUser, "password">>>>} - The service response containing user info.
 */
export const fetchUserById = async (
  userId: string
): Promise<ServiceResponse<Partial<Omit<AffiliateUser, "password">>>> => {
  try {
    const user = await AffiliateUser.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return {
        ok: false,
        message: messages.USER_NOT_EXISTS,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
      };
    }

    return {
      ok: true,
      message: "User fetched successfully.",
      statusCode: StatusCodes.OK,
      body: user.toJSON(),
    };
  } catch (error) {
    return {
      ok: false,
      message: "Failed to fetch user.",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
};

/**
 * Update user information by ID, excluding the password field from updates.
 * @param {number} userId - The ID of the user to update.
 * @param {Partial<Omit<AffiliateUser, 'password'>>} updateData - The data to update the user with.
 * @returns {Promise<ServiceResponse<Partial<Omit<AffiliateUser, "password">>>>} - The service response with updated user info.
 */
export const updateUserById = async (
  userId: string,
  updateData: Partial<AffiliateUser>
): Promise<ServiceResponse<Partial<Omit<AffiliateUser, "password">>>> => {
  try {
    // Ensure password is not part of the update
    const { password, ...allowedUpdates } = updateData;

    const user = await AffiliateUser.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return {
        ok: false,
        message: messages.USER_NOT_EXISTS,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
      };
    }

    await user.update(allowedUpdates);

    return {
      ok: true,
      message: messages.USER_UPDATED,
      statusCode: StatusCodes.OK,
      body: user.toJSON(),
    };
  } catch (error) {
    return {
      ok: false,
      message: "Failed to update user.",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
};

/**
 * Delete a user by ID.
 * @param {number} userId - The ID of the user to delete.
 * @returns {Promise<ServiceResponse<void>>} - The service response indicating the status of the operation.
 */
export const deleteAffiliateUserById = async (
  userId: string
): Promise<ServiceResponse<null>> => {
  try {
    const user = await AffiliateUser.findByPk(userId);

    if (!user) {
      return {
        ok: false,
        message: messages.USER_NOT_EXISTS,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
      };
    }

    await user.destroy();

    return {
      ok: true,
      message: messages.ACCOUNT_DELETED,
      statusCode: StatusCodes.NO_CONTENT,
      body: null,
    };
  } catch (error) {
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
 * Restore a deleted user by ID.
 * @param {number} userId - The ID of the user account to restore.
 * @return {Promise<ServiceResponse<Partial<AffiliateUser || null>>>} - The service response indicating the status of the operation and the restored user account.
 */
export const restoreAffiliateUserById = async (
  userId: string
): Promise<ServiceResponse<AffiliateUser | null>> => {
  try {
    const user = await AffiliateUser.findOne({
      where: { id: userId },
      paranoid: false,
    });

    if (!user) {
      return {
        ok: false,
        message: messages.USER_NOT_EXISTS,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
      };
    }

    await user.restore();

    return {
      ok: true,
      message: messages.ACCOUNT_RESTORED,
      statusCode: StatusCodes.OK,
      body: user,
    };
  } catch (error) {
    return {
      ok: false,
      message: "Failed to restore user.",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
};

/**
 * Create a new Affiliate User Activity in the database.
 * @param {Partial<Omit<AffiliateUserActivity, "id">>} data - The activity information to create a new Affiliate User Activity record.
 * @returns {Promise<ServiceResponse<{ activity: AffiliateUserActivity }>>} - A response object containing the status of the operation and the activity created.
 */
export const createAffiliateUserActivityService = async (
  data: Partial<Omit<AffiliateUserActivity, "id">>
): Promise<ServiceResponse<{ activity: AffiliateUserActivity }>> => {
  try {
    // Create a new activity record
    const activity = await AffiliateUserActivity.create(data);

    return {
      ok: true,
      message: "Activity created successfully.",
      statusCode: StatusCodes.CREATED,
      body: { activity },
    };
  } catch (error) {
    console.error(
      "Unexpected error in createAffiliateUserActivityService:",
      error
    );
    if (isSequelizeValidationError(error)) {
      return {
        ok: false,
        message: error.errors.map((err: any) => err.message).join(", "),
        statusCode: StatusCodes.BAD_REQUEST,
        body: null,
      };
    }

    if (isSequelizeUniqueConstraintError(error)) {
      return {
        ok: false,
        message: "Duplicate entry detected.",
        statusCode: StatusCodes.CONFLICT,
        body: null,
      };
    }

    if (isSequelizeDatabaseError(error)) {
      return {
        ok: false,
        message: "An error occurred while creating the activity.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: null,
      };
    }
    return {
      ok: false,
      message: "An unexpected error occurred while creating the activity.",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
};

/**
 * Retrieve Affiliate User Activities from the database based on filters.
 * @param {Object} filters - Filters to apply for retrieving activities.
 * @param {number} [filters.userId] - The ID of the user whose activities to fetch.
 * @param {EActivityType} [filters.activityType] - The type of activity to filter by.
 * @param {Date} [filters.startDate] - Start date to filter activities.
 * @param {Date} [filters.endDate] - End date to filter activities.
 * @param {number} [limit=10] - The maximum number of results to return.
 * @param {number} [page=1] - The page of results to return.
 * @returns {Promise<ServiceResponse<{ activities: AffiliateUserActivity[] }>>} - A response object containing the status of the operation and the activities retrieved.
 */
export const getAffiliateUserActivitiesService = async (
  filters: {
    userId?: string;
    activityType?: EActivityType;
    startDate?: Date;
    endDate?: Date;
  },
  limit: number = 10,
  page: number = 1
): Promise<ServiceResponse<{ activities: AffiliateUserActivity[] }>> => {
  try {
    const offset = (page - 1) * limit;
    const where: any = {};
    if (filters.userId) where.userId = filters.userId;
    if (filters.activityType) where.activityType = filters.activityType;
    if (filters.startDate || filters.endDate) {
      where.performedAt = {
        ...(filters.startDate ? { [Op.gte]: filters.startDate } : {}),
        ...(filters.endDate ? { [Op.lte]: filters.endDate } : {}),
      };
    }

    const activities = await AffiliateUserActivity.findAll({
      where,
      limit,
      offset,
    });

    return {
      ok: true,
      message: "Activities retrieved successfully.",
      statusCode: StatusCodes.OK,
      body: { activities },
    };
  } catch (error) {
    if (isSequelizeDatabaseError(error)) {
      return {
        ok: false,
        message: "Database error occurred while retrieving activities.",
        statusCode: StatusCodes.BAD_REQUEST,
        body: null,
      };
    }

    console.error(
      "Unexpected error in getAffiliateUserActivitiesService:",
      error
    );
    return {
      ok: false,
      message: "An unexpected error occurred while retrieving activities.",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
};

/**
 * Fetch the top 10 affiliate users based on tier level and total referrals, sorted by tier level and total referrals in descending order.
 *
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @param {string} [tokens.accessToken] - Access token for authentication.
 * @param {string} [tokens.refreshToken] - Refresh token for authentication.
 * @returns A ServiceResponse containing the list of top 10 affiliates.
 */
export const FetchTopAffiliateUsersService = async (tokens?: {
  accessToken?: string;
  refreshToken?: string;
}): Promise<
  ServiceResponse<{
    topAffiliates: Partial<AffiliateUser>[];
    tokens?: { accessToken?: string; refreshToken?: string };
  }>
> => {
  try {
    // Fetch top 10 affiliates based on tier level and total referrals
    const topAffiliates = await AffiliateUser.findAll({
      where: {
        is_active: true,
        is_verified: true,
      },
      order: [
        ["tier_level", "DESC"],
        ["total_referrals", "DESC"],
      ],
      limit: 10,
    });

    // Map affiliates to desired structure
    const affiliatesData = topAffiliates.map((affiliate) => ({
      id: affiliate.id,
      full_name: affiliate.full_name,
      email: affiliate.email,
      verification_status: affiliate.is_verified,
      total_referrals: affiliate.total_referrals,
      tier_level: affiliate.tier_level,
      registration_date: affiliate.created_at,
    }));

    return {
      ok: true,
      statusCode: StatusCodes.OK,
      message: messages.OK,
      body: {
        topAffiliates: affiliatesData,
      },
      tokens,
    };
  } catch (error) {
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
