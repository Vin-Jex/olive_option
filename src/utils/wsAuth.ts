import { isUUID } from "validator";
import { verifyToken } from "./Affiliate/jwt";
import { AffiliateUser } from "../models/Affiliate/AffiliateUser.Model";
import { validateRefreshToken } from "../utils/Affiliate/Validators/Token.Validator";
import { Staff } from "../models/Staff";

interface WsAuthResult {
  success: boolean;
  user?: any;
  newAccessToken?: string;
  refreshToken?: string;
  message?: string;
}

export const handleWsAuth = async (
  accessToken?: string,
  refreshToken?: string
): Promise<WsAuthResult> => {
  if (!accessToken || !refreshToken) {
    return {
      success: false,
      message: "Unauthorized: Missing tokens",
    };
  }

  let verifiedAccessToken = verifyToken(accessToken);
  let user: AffiliateUser | null = null;
  let staff: Staff | null = null;

  try {
    if (verifiedAccessToken === "Token Expired") {
      const newAccessToken = await validateRefreshToken(refreshToken);

      if (newAccessToken === "Token Expired") {
        return {
          success: false,
          message: "Session expired. Please log in again.",
        };
      }

      if (!newAccessToken) {
        return {
          success: false,
          message: "Invalid or inactive refresh token.",
        };
      }

      accessToken = newAccessToken;
      verifiedAccessToken = verifyToken(newAccessToken);
    }

    if (
      verifiedAccessToken &&
      typeof verifiedAccessToken !== "string" &&
      verifiedAccessToken.sub
    ) {
      const userId = verifiedAccessToken.sub.split("AFFILIATE-")[1];

      if (!userId || !isUUID(userId)) {
        return {
          success: false,
          message: "Invalid user ID format",
        };
      }

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

      if (user) {
        return {
          success: true,
          user,
          newAccessToken: accessToken,
          refreshToken,
        };
      }

      staff = await Staff.findOne({ where: { id: userId } });

      if (staff && staff.is_admin) {
        return {
          success: true,
          user: staff,
          newAccessToken: accessToken,
          refreshToken,
        };
      }

      return {
        success: false,
        message: "User not found",
      };
    }

    return {
      success: false,
      message: "Invalid access token",
    };
  } catch (error) {
    console.error("WS Auth Error:", error);
    return {
      success: false,
      message: "Internal error during authentication",
    };
  }
};
