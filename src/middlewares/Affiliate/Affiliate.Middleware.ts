import { Response, NextFunction, Request } from "express";
import { StatusCodes } from "http-status-codes";
import { messages } from "../../utils/consts";
import { AffiliateUser } from "../../models/Affiliate/AffiliateUser.Model";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "../../utils/Affiliate/jwt";
import { Staff } from "../../models/Staff";
import { validateRefreshToken } from "../../utils/Affiliate/Validators/Token.Validator";
import { validate as isUUID } from "uuid";

/**
 * Middleware to verify JWT token, refresh it if expired for affiliates,
 * and attach the user object and tokens to the request.
 *
 * @param {Request} req - The incoming request object containing headers with tokens.
 * @param {Response} res - The response object to send a response if authentication fails.
 * @param {NextFunction} next - Proceed to the next middleware or route handler.
 * @returns {Promise<Response | void>} - A promise that resolves to void or a response if authentication fails.
 */

export const authMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { accessToken, refreshToken } = parseTokens(req);

  // If tokens are not present, return unauthorized response
  if (!accessToken || !refreshToken) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      ok: false,
      message: messages.UNAUTHORIZED,
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  let verifiedAccessToken: JwtPayload | null | string;
  let user: AffiliateUser | null = null;
  let staff: Staff | null = null;

  try {
    // Verify the access token
    verifiedAccessToken = verifyToken(accessToken);

    // If access token is expired, attempt to refresh it
    if (verifiedAccessToken === "Token Expired") {
      // Validate the refresh token
      const newAccessToken = await validateRefreshToken(refreshToken);

      if (newAccessToken === "Token Expired") {
        // If refresh token is also expired
        return res.status(StatusCodes.UNAUTHORIZED).json({
          ok: false,
          message: messages.SESSION_EXPIRED,
          status: StatusCodes.UNAUTHORIZED,
        });
      }

      if (!newAccessToken) {
        // If refresh token is invalid or inactive
        return res.status(StatusCodes.UNAUTHORIZED).json({
          ok: false,
          message: messages.INVALID_REFRESH_TOKEN,
          status: StatusCodes.UNAUTHORIZED,
        });
      }

      // Attach new access token to the request and response
      req["accessToken"] = newAccessToken;
      req["refreshToken"] = refreshToken;
      res.setHeader("accesstoken", newAccessToken);
      res.setHeader("refreshtoken", refreshToken);

      // Verify the user again with the new access token
      verifiedAccessToken = verifyToken(newAccessToken);
    }

    // Proceed if access token is valid
    if (
      verifiedAccessToken &&
      typeof verifiedAccessToken !== "string" &&
      verifiedAccessToken.sub
    ) {
      const userId = verifiedAccessToken.sub.split("AFFILIATE-")[1];

      if (!userId || !isUUID(userId)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          ok: false,
          message: "Invalid user ID format",
          status: StatusCodes.BAD_REQUEST,
        });
      }

      // check if the user is a valid affiliate
      user = await AffiliateUser.findByPk(userId, {
        attributes: [
          "id",
          "full_name",
          "email",
          "referral_code",
          "is_active",
          "is_verified",
          "password",
          "verification_code",
          "verification_type",
          "last_login",
          "tier_level",
          "total_referrals",
          "referral_code",
          "country",
          "date_of_birth",
          "phone_number",
          "created_at",
          "updated_at",
          "deleted_at",
        ],
        raw: true,
      });

      // Attach the user object and proceed
      if (user) {
        req["user"] = user;
        return next();
      }

      // Check if the user is staff (admin)
      staff = await Staff.findOne({ where: { id: userId } });
      if (staff && staff.is_admin) {
        req["user"] = staff;
        return next();
      }

      if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          ok: false,
          message: messages.USER_NOT_FOUND,
          status: StatusCodes.UNAUTHORIZED,
        });
      }
    } else {
      return res.status(StatusCodes.FORBIDDEN).json({
        ok: false,
        message: messages.INVALID_ACCESS_TOKEN,
        status: StatusCodes.FORBIDDEN,
      });
    }
  } catch (error: any) {
    console.error("Error in auth middleware:", error);
    return res.status(StatusCodes.FORBIDDEN).json({
      ok: false,
      message: messages.INVALID_ACCESS_TOKEN,
      status: StatusCodes.FORBIDDEN,
    });
  }
};

const parseTokens = (req: Request) => {
  let accessToken = (req.headers["accesstoken"] as string) || "";
  let refreshToken = (req.headers["refreshtoken"] as string) || "";

  // Check cookies if tokens are missing
  if (!accessToken || !refreshToken) {
    accessToken = req.cookies?.accessToken || accessToken;
    refreshToken = req.cookies?.refreshToken || refreshToken;
  }

  // Check authorization header if still missing
  if (!accessToken || !refreshToken) {
    const authHeader =
      req.headers["authorization"] ||
      (req.headers["Authorization"] as string | undefined);

    if (authHeader?.startsWith("Bearer ")) {
      const tokenString = authHeader.substring(7);
      const tokenParts = tokenString.split(";").map((part) => part.trim());

      accessToken =
        tokenParts.find((t) => t.startsWith("accessToken="))?.split("=")[1] ||
        accessToken;
      refreshToken =
        tokenParts.find((t) => t.startsWith("refreshToken="))?.split("=")[1] ||
        refreshToken;
    }
  }

  return { accessToken, refreshToken };
};
