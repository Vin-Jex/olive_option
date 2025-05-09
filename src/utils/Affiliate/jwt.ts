import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { addHours, addMinutes, getUnixTime } from "date-fns";
import { AffiliateUser } from "../../models/Affiliate/AffiliateUser.Model";
import env from "../../config/config";


// Environment variables for expiry times
const ACCESS_TOKEN_EXPIRE_MIN = parseInt(process.env.ACCESS_TOKEN_EXPIRE_MIN!);
const REFRESH_TOKEN_EXPIRE_HOUR = parseInt(
  env.REFRESH_TOKEN_EXPIRE_HOUR!
);
const SECRET_KEY = process.env.SECRET_KEY!;
const URL_OF_APPLICATION = process.env.URL_OF_APPLICATION

/**
 * Generates a JWT access token.
 * @param {AffiliateUser} user - The user object containing user information.
 * @param {number} refId - The refresh token database ID.
 * @returns {string} - The generated JWT access token.
 */
export const generateAccessToken = (
  user: AffiliateUser,
  refId: number
): string => {
  const payload = {
    type: "access",
    ref_id: refId,
    sub: `AFFILIATE-${user.id}`,
    iat: getUnixTime(new Date()),
    exp: getUnixTime(addMinutes(new Date(), ACCESS_TOKEN_EXPIRE_MIN)),
    iss: URL_OF_APPLICATION,
  };
  return jwt.sign(payload, SECRET_KEY);
};

/**
 * Generates a JWT refresh token.
 * @param {AffiliateUser} user - The user object containing user information.
 * @returns {string} - The generated JWT refresh token.
 */
export const generateRefreshToken = (user: AffiliateUser): string => {
  const payload = {
    type: "refresh",
    sub: `AFFILIATE-${user.id}`,
    iat: getUnixTime(new Date()),
    exp: getUnixTime(addHours(new Date(), REFRESH_TOKEN_EXPIRE_HOUR)),
    iss: URL_OF_APPLICATION,
  };
  return jwt.sign(payload, SECRET_KEY);
};

/**
 * Verifies a JWT token and returns the decoded payload.
 * @param {string} token - The JWT token to verify.
 * @returns {JwtPayload | null} - The decoded payload if still active, null if verification fails and string when token is expired.
 */

export const verifyToken = (token: string): JwtPayload | null | string => {
  try {
    return jwt.verify(token, SECRET_KEY) as JwtPayload;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return "Token Expired";
    }
    return null;
  }
};



