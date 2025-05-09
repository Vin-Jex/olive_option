import dayjs from "dayjs";
import { Transaction } from "../../models/Transaction";
import { Op } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { AffiliateUser } from "../../models/Affiliate/AffiliateUser.Model";
import { AffiliateClick } from "../../models/Affiliate/AffiliateClicks.Model";
import { ServiceResponse } from "../../types/Affiliate/Affiliate.types";
import { messages } from "../../utils/consts";
import { StatusCodes } from "http-status-codes";
import {
  PushUpdateToAffiliateDashboardOverview,
  PushUpdateToAffiliateRevenueShareOverview,
  PushUpdateToAffiliateTurnoverShareOverview,
  PushUpdateToAffiliateSubAffiliateOverview,
} from "../../config/ws";
import { User } from "../../models/User";
import { log } from "../../utils/logger";
import {
  REVENUE_RATES,
  REVENUE_THRESHOLDS,
  RevenueShareBody,
  SUB_RATES,
  SUB_THRESHOLDS,
  SubAffiliateBody,
  TURNOVER_RATES,
  TURNOVER_THRESHOLDS,
  TurnoverShareBody,
} from "../../types/Affiliate/affiliate-overview.types";



interface UpdateAffiliateDataOptions {
  userId: string;
  tokens?: { accessToken?: string; refreshToken?: string };
  service: (
    userId: string,
    tokens?: { accessToken?: string; refreshToken?: string }
  ) => Promise<ServiceResponse<object>>;
  pushUpdateFn: (userId: string, result: ServiceResponse<object>) => void;
}

export const updateAffiliateData = async (
  options: UpdateAffiliateDataOptions
) => {
  const { userId, tokens, service, pushUpdateFn } = options;
  const result = await service(userId, tokens);
  pushUpdateFn(userId, result);
};

export const updateAffiliateDashboard = (
  userId: string,
  tokens?: { accessToken?: string; refreshToken?: string }
) =>
  updateAffiliateData({
    userId,
    tokens,
    service: GetAffiliateDashboardService,
    pushUpdateFn: PushUpdateToAffiliateDashboardOverview,
  });

export const updateAffiliateRevenueShare = (
  userId: string,
  tokens?: { accessToken?: string; refreshToken?: string }
) =>
  updateAffiliateData({
    userId,
    tokens,
    service: GetAffiliateRevenueShareService,
    pushUpdateFn: PushUpdateToAffiliateRevenueShareOverview,
  });

export const updateAffiliateTurnoverShare = (
  userId: string,
  tokens?: { accessToken?: string; refreshToken?: string }
) =>
  updateAffiliateData({
    userId,
    tokens,
    service: GetAffiliateTurnoverShareService,
    pushUpdateFn: PushUpdateToAffiliateTurnoverShareOverview,
  });

export const updateAffiliateSubAffiliate = (
  userId: string,
  tokens?: { accessToken?: string; refreshToken?: string }
) =>
  updateAffiliateData({
    userId,
    tokens,
    service: GetAffiliateSubAffiliateService,
    pushUpdateFn: PushUpdateToAffiliateSubAffiliateOverview,
  });

const getMaxTierLevel = async (userId: string): Promise<number> => {
  try {
    const [revenueShare, turnoverShare, subAffiliate] = await Promise.all([
      GetAffiliateRevenueShareService(userId),
      GetAffiliateTurnoverShareService(userId),
      GetAffiliateSubAffiliateService(userId),
    ]);

    const levels = [
      revenueShare.body?.currentLevel || 1,
      turnoverShare.body?.currentLevel || 1,
      subAffiliate.body?.currentLevel || 1,
    ];

    return Math.max(...levels);
  } catch (error) {
    console.error("Error getting max tier level:", error);
    return 1;
  }
};

export const updateAffiliateTierLevel = async (
  userId: string,
  newLevel?: number
) => {
  try {
    const affiliate = await AffiliateUser.findByPk(userId);
    if (!affiliate) return;

    const maxLevel = newLevel ?? (await getMaxTierLevel(userId));

    if (affiliate.tier_level < maxLevel) {
      await affiliate.update({ tier_level: maxLevel });
      log("info", `Updated tier level to ${maxLevel} for affiliate ${userId}`);
    }
  } catch (error) {
    console.error("Error updating tier level:", error);
  }
};

export const GetAffiliateDashboardService = async (
  userId: string,
  tokens?: {
    accessToken?: string;
    refreshToken?: string;
  }
): Promise<ServiceResponse<object>> => {
  try {
    const affiliate = await AffiliateUser.findByPk(userId);
    if (!affiliate) {
      return {
        ok: false,
        message: "Affiliate not found.",
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
        tokens,
      };
    }

    // Fetch deposits for affiliate user type, grouped by date
    const depositsData = await Transaction.findAll({
      where: {
        user_id: userId,
        user_type: "affiliate",
        type: "credit",
        status: "completed",
      },
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("created_at")), "date"],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "totalAmount"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],
      group: [Sequelize.fn("DATE", Sequelize.col("created_at"))],
      order: [[Sequelize.fn("DATE", Sequelize.col("created_at")), "ASC"]],
    });

    // Fetch the first time deposit (FTD)
    const firstTimeDepositData = await Transaction.findAll({
      where: {
        user_id: userId,
        user_type: "affiliate",
        type: "credit",
        status: "completed",
      },
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("created_at")), "date"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],
      group: [Sequelize.fn("DATE", Sequelize.col("created_at"))],
      order: [[Sequelize.fn("DATE", Sequelize.col("created_at")), "ASC"]],
      limit: 1,
    });

    const firstTimeDeposit = (firstTimeDepositData || []).map((entry: any) => ({
      date: entry.getDataValue("date"),
      count: parseInt(entry.getDataValue("count")),
    }));

    // Fetch wallet data for the affiliate
    const profitData = await Transaction.findAll({
      where: {
        user_id: userId,
        user_type: "affiliate",
        type: "bonus",
        status: "completed",
      },
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("created_at")), "date"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],
      group: [Sequelize.fn("DATE", Sequelize.col("created_at"))],
      order: [[Sequelize.fn("DATE", Sequelize.col("created_at")), "ASC"]],
    });

    const profit = (profitData || []).map((entry: any) => ({
      date: entry.getDataValue("date"),
      count: parseInt(entry.getDataValue("count")),
    }));

    // Calculate the total deposit amount across all days
    const totalDepositAmount = depositsData.reduce(
      (sum, entry: any) => sum + parseFloat(entry.totalAmount),
      0
    );

    // Transform the result into a usable format
    const dashboardData = depositsData.map((entry: any) => ({
      date: entry.date,
      totalAmount: entry.totalAmount,
      count: entry.count,
    }));

    const newReferrals = await AffiliateUser.findAll({
      where: {
        referred_by: affiliate.referral_code,
      },
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("created_at")), "date"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],
      group: [Sequelize.fn("DATE", Sequelize.col("created_at"))],
      order: [[Sequelize.fn("DATE", Sequelize.col("created_at")), "ASC"]],
    });

    const clicksData = await AffiliateClick.findAll({
      where: {
        userId: affiliate.id,
      },
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("clickedAt")), "date"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],
      group: [Sequelize.fn("DATE", Sequelize.col("clickedAt"))],
      order: [[Sequelize.fn("DATE", Sequelize.col("clickedAt")), "ASC"]],
    });

    const registration = newReferrals.map((entry: any) => ({
      date: entry.getDataValue("date"),
      count: parseInt(entry.getDataValue("count")),
    }));

    const clicks = clicksData.map((entry: any) => ({
      date: entry.getDataValue("date"),
      count: parseInt(entry.getDataValue("count")),
    }));

    // Prepare the data to send over WebSocket

    const dashboardOverviewData = {
      totalDepositAmount,
      deposits: dashboardData,
      firstTimeDeposit,
      profit,
      registration,
      clicks,
    };

    const result = {
      ok: true,
      message: "Dashboard data fetched successfully.",
      statusCode: StatusCodes.OK,
      body: dashboardOverviewData,
      tokens,
    };

    // Push the update to the connected WebSocket for the user
    PushUpdateToAffiliateDashboardOverview(userId, result);

    return result;
  } catch (error) {
    console.error("Update ERROR", error);
    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
      tokens,
    };
  }
};

export const GetAffiliateRevenueShareService = async (
  userId: string,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<RevenueShareBody>> => {
  try {
    const affiliate = await AffiliateUser.findByPk(userId);
    if (!affiliate) {
      return {
        ok: false,
        message: "Affiliate not found.",
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
        tokens,
      };
    }

    // last calendar month
    const start = dayjs().subtract(1, "month").startOf("month").toDate();
    const end = dayjs().subtract(1, "month").endOf("month").toDate();

    // get all traders referred by this affiliate
    const referred = await AffiliateUser.findAll({
      where: { referred_by: affiliate.referral_code },
      attributes: ["id"],
    });
    const traderIds = referred.map((u) => u.id);

    // 1) countOfFTD (unique traders who made ≥1 deposit)
    const ftdResult = await Transaction.findAll({
      where: {
        user_id: traderIds,
        user_type: "user",
        type: "credit",
        status: "completed",
        created_at: { [Op.between]: [start, end] },
      },
      attributes: [
        [
          Sequelize.fn(
            "COUNT",
            Sequelize.fn("DISTINCT", Sequelize.col("user_id"))
          ),
          "countOfFTD",
        ],
      ],
    });
    const countOfFTD = parseInt(ftdResult[0].getDataValue("countOfFTD") ?? "0");

    // 2) numberOfDeposits & sumOfDeposits
    const depResult = await Transaction.findAll({
      where: {
        user_id: traderIds,
        user_type: "user",
        type: "credit",
        status: "completed",
        created_at: { [Op.between]: [start, end] },
      },
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("id")), "numberOfDeposits"],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "sumOfDeposits"],
      ],
    });
    const numberOfDeposits = parseInt(
      depResult[0].getDataValue("numberOfDeposits") ?? "0"
    );
    const sumOfDeposits = parseFloat(
      depResult[0].getDataValue("sumOfDeposits") ?? "0"
    );

    // determine currentLevel
    let currentLevel = 1;
    for (let i = 0; i < REVENUE_THRESHOLDS.length; i++) {
      if (countOfFTD >= REVENUE_THRESHOLDS[i]) currentLevel = i + 1;
      else break;
    }

    await updateAffiliateTierLevel(userId, currentLevel);

    const nextLevel = Math.min(currentLevel + 1, REVENUE_THRESHOLDS.length);
    const nextThreshold = REVENUE_THRESHOLDS[nextLevel - 1];
    const numberOfDepositsUntilNextLevel =
      currentLevel === REVENUE_THRESHOLDS.length
        ? 0
        : Math.max(nextThreshold - countOfFTD, 0);

    const currentRatePercentage = REVENUE_RATES[currentLevel - 1];
    const estimatedCommission = (sumOfDeposits * currentRatePercentage) / 100;

    const body = {
      countOfFTD,
      numberOfDeposits,
      sumOfDeposits,
      currentLevel,
      nextLevel,
      numberOfDepositsUntilNextLevel,
      currentRatePercentage,
      estimatedCommission,
    };

    const result = {
      ok: true,
      message: "Revenue share data fetched successfully.",
      statusCode: StatusCodes.OK,
      body,
      tokens,
    };

    PushUpdateToAffiliateRevenueShareOverview(userId, result);
    return result;
  } catch (error) {
    console.error("Revenue Share ERROR", error);
    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
      tokens,
    };
  }
};

export const GetAffiliateTurnoverShareService = async (
  userId: string,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<TurnoverShareBody>> => {
  try {
    const affiliate = await AffiliateUser.findByPk(userId);
    if (!affiliate) {
      return {
        ok: false,
        message: "Affiliate not found.",
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
        tokens,
      };
    }

    const start = dayjs().subtract(1, "month").startOf("month").toDate();
    const end = dayjs().subtract(1, "month").endOf("month").toDate();

    // referred traders
    const referred = await AffiliateUser.findAll({
      where: { referred_by: affiliate.referral_code },
      attributes: ["id"],
    });
    const traderIds = referred.map((u) => u.id);

    const ftdResult = await Transaction.findAll({
      where: {
        user_id: traderIds,
        user_type: "user",
        type: "credit",
        status: "completed",
        created_at: { [Op.between]: [start, end] },
      },
      attributes: [
        [
          Sequelize.fn(
            "COUNT",
            Sequelize.fn("DISTINCT", Sequelize.col("user_id"))
          ),
          "countOfFTD",
        ],
      ],
    });
    const countOfFTD = parseInt(ftdResult[0].getDataValue("countOfFTD") ?? "0");

    const depResult = await Transaction.findAll({
      where: {
        user_id: traderIds,
        user_type: "user",
        type: "credit",
        status: "completed",
        created_at: { [Op.between]: [start, end] },
      },
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("id")), "numberOfDeposits"],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "sumOfDeposits"],
      ],
    });
    const numberOfDeposits = parseInt(
      depResult[0].getDataValue("numberOfDeposits") ?? "0"
    );
    const sumOfDeposits = parseFloat(
      depResult[0].getDataValue("sumOfDeposits") ?? "0"
    );

    // fetch total trading turnover
    const turnoverRes = await User.findAll({
      where: {
        user_id: traderIds,
        created_at: { [Op.between]: [start, end] },
      },
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("volume")), "totalTurnover"],
      ],
    });
    const totalTurnover = parseFloat(
      turnoverRes[0].getDataValue("totalTurnover") ?? "0"
    );

    // fetch total bonuses paid to traders (for K ratio)
    const bonusRes = await Transaction.findAll({
      where: {
        user_id: traderIds,
        user_type: "user",
        type: "bonus",
        status: "completed",
        created_at: { [Op.between]: [start, end] },
      },
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("amount")), "totalBonus"],
      ],
    });
    const totalBonus = parseFloat(
      bonusRes[0].getDataValue("totalBonus") ?? "0"
    );
    const K_ratio_adjustment =
      sumOfDeposits + totalBonus > 0
        ? sumOfDeposits / (sumOfDeposits + totalBonus)
        : 1;

    // level logic by countOfFTD
    let currentLevel = 1;
    for (let i = 0; i < TURNOVER_THRESHOLDS.length; i++) {
      if (countOfFTD >= TURNOVER_THRESHOLDS[i]) currentLevel = i + 1;
      else break;
    }

    await updateAffiliateTierLevel(userId, currentLevel);

    const nextLevel = Math.min(currentLevel + 1, TURNOVER_THRESHOLDS.length);
    const nextThreshold = TURNOVER_THRESHOLDS[nextLevel - 1];
    const numberOfDepositsUntilNextLevel =
      currentLevel === TURNOVER_THRESHOLDS.length
        ? 0
        : Math.max(nextThreshold - countOfFTD, 0);

    const currentRatePercentage = TURNOVER_RATES[currentLevel - 1];
    const estimatedCommission =
      ((totalTurnover * currentRatePercentage) / 100) * K_ratio_adjustment;

    const body = {
      countOfFTD,
      numberOfDeposits,
      sumOfDeposits,
      totalTurnover,
      K_ratio_adjustment,
      currentLevel,
      nextLevel,
      numberOfDepositsUntilNextLevel,
      currentRatePercentage,
      estimatedCommission,
    };

    const result = {
      ok: true,
      message: "Turnover share data fetched successfully.",
      statusCode: StatusCodes.OK,
      body,
      tokens,
    };

    PushUpdateToAffiliateTurnoverShareOverview(userId, result);
    return result;
  } catch (error) {
    console.error("Turnover Share ERROR", error);
    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
      tokens,
    };
  }
};

export const GetAffiliateSubAffiliateService = async (
  userId: string,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<SubAffiliateBody>> => {
  try {
    const affiliate = await AffiliateUser.findByPk(userId);
    if (!affiliate) {
      return {
        ok: false,
        message: "Affiliate not found.",
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
        tokens,
      };
    }

    const start = dayjs().subtract(1, "month").startOf("month").toDate();
    const end = dayjs().subtract(1, "month").endOf("month").toDate();

    // 1) find sub‑affiliates
    const subAffs = await AffiliateUser.findAll({
      where: { referred_by: affiliate.referral_code },
      attributes: ["id"],
    });
    const subIds = subAffs.map((u) => u.id);

    // 2) deposits by those sub‑affiliates' referred traders
    const depResult = await Transaction.findAll({
      where: {
        user_id: subIds,
        user_type: "affiliate",
        type: "credit",
        status: "completed",
        created_at: { [Op.between]: [start, end] },
      },
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("id")), "numberOfDeposits"],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "sumOfDeposits"],
      ],
    });
    const numberOfDeposits = parseInt(
      depResult[0].getDataValue("numberOfDeposits") ?? "0"
    );
    const sumOfDeposits = parseFloat(
      depResult[0].getDataValue("sumOfDeposits") ?? "0"
    );

    // 3) unique traders under those sub‑affiliates
    const ftdResult = await Transaction.findAll({
      where: {
        user_id: subIds,
        user_type: "affiliate",
        type: "credit",
        status: "completed",
        created_at: { [Op.between]: [start, end] },
      },
      attributes: [
        [
          Sequelize.fn(
            "COUNT",
            Sequelize.fn("DISTINCT", Sequelize.col("user_id"))
          ),
          "countOfFTD",
        ],
      ],
    });
    const countOfFTD = parseInt(ftdResult[0].getDataValue("countOfFTD") ?? "0");

    let currentLevel = 1;
    for (let i = 0; i < SUB_THRESHOLDS.length; i++) {
      if (countOfFTD >= SUB_THRESHOLDS[i]) currentLevel = i + 1;
      else break;
    }

    await updateAffiliateTierLevel(userId, currentLevel);

    const nextLevel = Math.min(currentLevel + 1, SUB_THRESHOLDS.length);
    const nextThreshold = SUB_THRESHOLDS[nextLevel - 1];
    const numberOfDepositsUntilNextLevel =
      currentLevel === SUB_THRESHOLDS.length
        ? 0
        : Math.max(nextThreshold - countOfFTD, 0);

    const currentRatePercentage = SUB_RATES[currentLevel - 1];
    const estimatedCommission = (sumOfDeposits * currentRatePercentage) / 100;

    const body = {
      countOfFTD,
      numberOfDeposits,
      sumOfDeposits,
      currentLevel,
      nextLevel,
      numberOfDepositsUntilNextLevel,
      currentRatePercentage,
      estimatedCommission,
    };

    const result = {
      ok: true,
      message: "Sub‑Affiliate data fetched successfully.",
      statusCode: StatusCodes.OK,
      body,
      tokens,
    };

    PushUpdateToAffiliateSubAffiliateOverview(userId, result);
    return result;
  } catch (error) {
    console.error("Sub‑Affiliate ERROR", error);
    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
      tokens,
    };
  }
};
