import { Sequelize } from "sequelize";
import { AffiliateUser } from "../../models/Affiliate/AffiliateUser.Model";
import { ServiceResponse } from "../../types/Affiliate/Affiliate.types";
import { StatusCodes } from "http-status-codes";
import { Transaction } from "../../models/Transaction";
import { AffiliateUserActivity } from "../../models/Affiliate/AffiliateActivities.Model";
import { PushUpdateToTopAffiliates } from "../../config/ws";

// Top Affiliates
export const GetTopAffiliatesService = async (tokens?: {
  accessToken?: string;
  refreshToken?: string;
}): Promise<ServiceResponse<object>> => {
  try {
    const affiliates = await AffiliateUser.findAll({
      where: { is_active: true },
      attributes: [
        "id",
        "full_name",
        "email",
        "referral_code",
        "tier_level",
        "total_referrals",
        "country",
        "created_at",
      ],
    });

    if (!affiliates.length) {
      return {
        ok: false,
        message: "No affiliates found.",
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
      };
    }

    const transactions = await Transaction.findAll({
      where: {
        user_type: "affiliate",
        type: "credit",
        status: "completed",
      },
      attributes: [
        "user_id",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "depositCount"],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "totalDepositAmount"],
      ],
      group: ["user_id"],
      raw: true,
    });

    const ftds = await Transaction.findAll({
      where: {
        user_type: "affiliate",
        type: "credit",
        status: "completed",
      },
      attributes: [
        "user_id",
        [Sequelize.fn("MIN", Sequelize.col("created_at")), "firstDepositDate"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "firstTimeDepositCount"],
      ],
      group: ["user_id"],
      raw: true,
    });

    const activities = await AffiliateUserActivity.findAll({
      attributes: [
        "userId",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "activityCount"],
      ],
      group: ["userId"],
      raw: true,
    });

    const affiliateStats = affiliates.map((affiliate) => {
      const tx = transactions.find((t) => t.user_id === affiliate.id) || {};
      const fd = ftds.find((t) => t.user_id === affiliate.id) || {};
      const act = activities.find((a) => a.userId === affiliate.id) || {};

      return {
        ...affiliate.get(),
        depositCount: parseInt((tx as any).depositCount ?? "0", 10),
        firstTimeDepositCount: parseInt(
          (fd as any).firstTimeDepositCount ?? "0",
          10
        ),
        totalDepositAmount: parseFloat((tx as any).totalDepositAmount ?? "0"),
        firstDepositDate: fd ? (fd as any).firstDepositDate : null,
        activityCount: parseInt((act as any).activityCount ?? "0", 10),
      };
    });

    const sortedAffiliates = affiliateStats.sort((a, b) => {
      if (a.firstDepositDate && b.firstDepositDate) {
        const diff =
          new Date(a.firstDepositDate).getTime() -
          new Date(b.firstDepositDate).getTime();
        if (diff !== 0) return diff;
      }
      if (b.depositCount !== a.depositCount) {
        return b.depositCount - a.depositCount;
      }
      if (b.tier_level !== a.tier_level) {
        return b.tier_level - a.tier_level;
      }
      return b.activityCount - a.activityCount;
    });

    const topAffiliates = sortedAffiliates.slice(0, 15);

    return {
      ok: true,
      message: "Top affiliates fetched successfully.",
      statusCode: StatusCodes.OK,
      body: topAffiliates,
      tokens,
    };
  } catch (error) {
    console.error("Top Affiliates Fetch Error:", error);
    return {
      ok: false,
      message: "Internal server error.",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
};

export const updateTopAffiliates = async (
  userId: string,
  tokens?: { accessToken?: string; refreshToken?: string }
) => {
  const result = await GetTopAffiliatesService(tokens);
  if (result.ok && result.body) {
    PushUpdateToTopAffiliates(userId, result);
  }
  return result;
};
