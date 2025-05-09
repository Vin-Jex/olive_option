import { AffiliateUser } from "../../../models/Affiliate/AffiliateUser.Model";
import { AffiliateUserToken } from "../../../models/Affiliate/AffiliateUserToken.Model";
import { generateAccessToken, verifyToken } from "../jwt";
import { getUnixTime } from "date-fns";

export const validateRefreshToken = async (
  token: string
): Promise<string | null> => {
  const decodedToken = verifyToken(token);

  // Token is invalid or verification failed
  if (!decodedToken || typeof decodedToken === "string") {
    return null;
  }

  if (decodedToken.type !== "refresh") {
    return null;
  }

  const refreshTokenObj = await AffiliateUserToken.findOne({
    where: { token },
  });

  if (refreshTokenObj && !refreshTokenObj.is_active) {
    await AffiliateUserToken.destroy({ where: { id: refreshTokenObj.id } });
    return null;
  }

  // If the token is not found, return null
  if (!refreshTokenObj) {
    return null;
  }

  // Retrieve the user associated with the refresh token
  const user = await AffiliateUser.findByPk(refreshTokenObj.userId);

  // Check if the user is null before proceeding
  if (!user) {
    // Invalidate the token as the user does not exist
    await AffiliateUserToken.destroy({ where: { id: refreshTokenObj.id } });
    return null;
  }

  // Generate and return a new access token
  const newAccessToken = generateAccessToken(user, refreshTokenObj.id);

  return newAccessToken;
};

/**
 * Verifies if access token returned has expired.
 * @param {string} refreshToken - The JWT refresh token to verify.
 * @returns {boolean | null} - Returns true if the access token has expired, false if the token has not expired, and null if the token is invalid.
 */
export const isAccessTokenExpired = (refreshToken: string): boolean | null => {
  const decodedToken = verifyToken(refreshToken);

  if (!decodedToken || typeof decodedToken === "string") {
    return null;
  }

  // Token type is not access
  if (decodedToken.type !== "access") {
    return null;
  }

  const currentTime = getUnixTime(new Date());
  const accessTokenExpirationTime = decodedToken.exp;

  return currentTime > accessTokenExpirationTime!;
};

/**
 * Checks if the provided token (access or refresh) has expired.
 * @param {string} token - The JWT token to verify.
 * @returns {boolean | null} - Returns true if the token has expired, false if it's still valid, and null if the token is invalid.
 */
export const isRefreshTokenExpired = (token: string): boolean | null => {
  const decodedToken = verifyToken(token);

  if (!decodedToken || typeof decodedToken === "string") {
    return null;
  }

  const currentTime = getUnixTime(new Date());
  const refreshTokenExpirationTime = decodedToken.exp;

  return currentTime > refreshTokenExpirationTime!;
};
