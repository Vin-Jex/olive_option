import { Sequelize } from "sequelize-typescript";
import env from "./config";
import { User } from "../models/User";
import { UserSetting } from "../models/UserSetting";
import { Otp } from "../models/Otp";
import { PinnedOption } from "../models/PinnedOption";
import { Wallet } from "../models/Wallet";
import { Transaction } from "../models/Transaction";
import { Order } from "../models/Order";
import { Staff } from "../models/Staff";
import { StaffPermission } from "../models/StaffPermission";
import { StaffActivity } from "../models/StaffActivity";
import { StaffOtp } from "../models/StaffOtp";
import { Affiliate } from "../models/Affiliate/Affiliate.Model";
import { RevenueSharing } from "../models/Affiliate/RevenueSharing.Model";
import { TurnoverSharing } from "../models/Affiliate/TurnoverSharing.Model";
import { Deposit } from "../models/Affiliate/Deposit.Model";
import { Content } from "../models/Content";
import { Faq } from "../models/Faq";
import { FaqCategory } from "../models/FaqCategory";
import { AffiliateUser } from "../models/Affiliate/AffiliateUser.Model";
import { AffiliateUserToken } from "../models/Affiliate/AffiliateUserToken.Model";
import { PromotionalMaterialSection } from "../models/PromotionalMaterialSection";
import { PromotionalMaterial } from "../models/PromotionalMaterial";
import { Setting } from "../models/Setting";
import { BlockedIp } from "../models/BlockedIp";
import { CustomProfitOutcome } from "../models/CustomProfitOutcome";
import { ComissionException } from "../models/ComissionException";
import { AffiliateLink } from "../models/Affiliate/Link.Model";
import { LinkType } from "../models/Affiliate/LinkType.Model";
import { AffiliateProgram } from "../models/Affiliate/AffiliateProgram.Model";
import { AffiliateUserActivity } from "../models/Affiliate/AffiliateActivities.Model";
import { AffiliateClick } from "../models/Affiliate/AffiliateClicks.Model";
import { AffiliateTelegramLink } from "../models/Affiliate/AffiliateTelegramLinks.Model";
import { PromoCode } from "../models/Affiliate/PromoCode.Model";
import { Alert } from "../models/Alert";
import { TradePair } from "../models/TradePair";
import { Postback } from "../models/Affiliate/AffiliatePostbacks.Model";
import { SupportMessage } from "../models/Affiliate/AffiliateSupport.Model";
import { KYCVerification } from "../models/KYCVerification.Model";

export const sequelize = new Sequelize(env.DB_CONNECTION_STRING, {
  logging: false,
});

sequelize.addModels([
  User,
  UserSetting,
  Otp,
  PinnedOption,
  Wallet,
  Transaction,
  Order,
  Staff,
  StaffPermission,
  StaffActivity,
  StaffOtp,
  AffiliateUser,
  Affiliate,
  AffiliateLink,
  AffiliateTelegramLink,
  LinkType,
  PromoCode,
  AffiliateProgram,
  RevenueSharing,
  TurnoverSharing,
  Deposit,
  AffiliateUserToken,
  AffiliateUserActivity,
  AffiliateClick,
  Postback,
  SupportMessage,
  Content,
  Faq,
  FaqCategory,
  PromotionalMaterialSection,
  PromotionalMaterial,
  Setting,
  BlockedIp,
  CustomProfitOutcome,
  ComissionException,
  Alert,
  TradePair,
  KYCVerification,
]);

User.hasOne(UserSetting, { as: "settings", foreignKey: "user_id" });
UserSetting.belongsTo(User, { as: "user", foreignKey: "user_id" });

User.hasMany(Otp, { as: "otps", foreignKey: "user_id" });
Otp.belongsTo(User, { as: "user", foreignKey: "user_id" });

User.hasMany(PinnedOption, { as: "pinned_options", foreignKey: "user_id" });
PinnedOption.belongsTo(User, { as: "user", foreignKey: "user_id" });


User.hasMany(KYCVerification, {
  as: "kyc_verifications",
  foreignKey: "user_id",
});

KYCVerification.belongsTo(User, {
  as: "kyc_user",
  foreignKey: "user_id",
});

// User.hasMany(Wallet, { as: "wallets", foreignKey: "user_id" });
// Wallet.belongsTo(User, { as: "user", foreignKey: "user_id" });

// User.hasMany(Transaction, { as: "user_transactions", foreignKey: "user_id" });
// Transaction.belongsTo(User, { as: "transaction_user", foreignKey: "user_id" });


AffiliateUser.hasMany(Transaction, {
  foreignKey: "user_id",
  as: "AffiliateTransactions",
});
Transaction.belongsTo(AffiliateUser, {
  foreignKey: "user_id",
  as: "AffiliateUser",
});

Wallet.hasMany(Transaction, {
  as: "wallet_transactions",
  foreignKey: "wallet_id",
});
Transaction.belongsTo(Wallet, {
  as: "transaction_wallet",
  foreignKey: "wallet_id",
});

User.hasMany(Order, { as: "user_orders", foreignKey: "user_id" });
Order.belongsTo(User, { as: "order_user", foreignKey: "user_id" });

Transaction.hasOne(Order, { as: "order", foreignKey: "transaction_id" });
Order.belongsTo(Transaction, {
  as: "transaction",
  foreignKey: "transaction_id",
});

Staff.hasOne(StaffPermission, { as: "permissions", foreignKey: "staff_id" });
StaffPermission.belongsTo(Staff, { as: "staff", foreignKey: "staff_id" });

Staff.hasMany(StaffActivity, { as: "activities", foreignKey: "staff_id" });
StaffActivity.belongsTo(Staff, { as: "staff", foreignKey: "staff_id" });

Staff.hasMany(StaffOtp, { as: "otps", foreignKey: "staff_id" });
StaffOtp.belongsTo(Staff, { as: "staff", foreignKey: "staff_id" });

FaqCategory.hasMany(Faq, { as: "faqs", foreignKey: "category_id" });
Faq.belongsTo(FaqCategory, { as: "category", foreignKey: "category_id" });

User.hasMany(Alert, { as: "alerts", foreignKey: "user_id" });
Alert.belongsTo(User, { as: "user", foreignKey: "user_id" });

PromotionalMaterialSection.hasMany(PromotionalMaterial, {
  as: "materials",
  foreignKey: "section_id",
});
PromotionalMaterial.belongsTo(PromotionalMaterialSection, {
  as: "section",
  foreignKey: "section_id",
});

// Affiliate - AffiliateUser relationship
AffiliateUser.hasMany(Affiliate, {
  as: "AffiliateUsers",
  foreignKey: "userId",
});
Affiliate.belongsTo(AffiliateUser, { as: "affiliate", foreignKey: "userId" });

// One user can refer many others
AffiliateUser.hasMany(AffiliateUser, {
  sourceKey: "referral_code",
  foreignKey: "referred_by",
  as: "referrals",
});

// A user was referred by one user
AffiliateUser.belongsTo(AffiliateUser, {
  foreignKey: "referred_by",
  targetKey: "referral_code",
  as: "referrer",
});

// Affiliate - RevenueSharing relationship
Affiliate.hasOne(RevenueSharing, {
  as: "revenue_sharing",
  foreignKey: "affiliateId",
});
RevenueSharing.belongsTo(Affiliate, {
  as: "affiliate",
  foreignKey: "affiliateId",
});

// Affiliate - TurnoverSharing relationship
Affiliate.hasOne(TurnoverSharing, {
  as: "turnover_sharing",
  foreignKey: "affiliateId",
});
TurnoverSharing.belongsTo(Affiliate, {
  as: "affiliate",
  foreignKey: "affiliateId",
});

// AffiliateUserToken - AffiliateUser relationship
AffiliateUserToken.belongsTo(AffiliateUser, {
  as: "user",
  foreignKey: "userId",
});
AffiliateUser.hasMany(AffiliateUserToken, {
  as: "AffiliateUserTokens",
  foreignKey: "userId",
});
// AffiliateUser and AffiliateLink relationship
AffiliateUser.hasMany(AffiliateLink, {
  as: "AffiliateLinks",
  foreignKey: "userId",
});
AffiliateLink.belongsTo(AffiliateUser, {
  as: "user",
  foreignKey: "userId",
});

// AffiliateLink and LinkType relationship
LinkType.hasMany(AffiliateLink, {
  as: "Links",
  foreignKey: "linkTypeId",
});
AffiliateLink.belongsTo(LinkType, {
  as: "LinkType",
  foreignKey: "linkTypeId",
});

// AffiliateLink and AffiliateProgram relationship
AffiliateProgram.hasMany(AffiliateLink, {
  as: "Links",
  foreignKey: "affiliateProgramId",
});
AffiliateLink.belongsTo(AffiliateProgram, {
  as: "AffiliateProgram",
  foreignKey: "affiliateProgramId",
});

// AffiliateUser and UserActivity relationship
AffiliateUserActivity.belongsTo(AffiliateUser, {
  as: "user",
  foreignKey: "userId",
});
AffiliateUser.hasMany(AffiliateUserActivity, {
  as: "AffiliateUserActivities",
  foreignKey: "userId",
});

// AffiliateUser and AffiliateClicks relationship
AffiliateClick.belongsTo(AffiliateUser, {
  as: "user",
  foreignKey: "userId",
});
AffiliateUser.hasMany(AffiliateClick, {
  as: "AffiliateClicks",
  foreignKey: "userId",
});

// AffiliateUser and AffiliateLinks relationship
AffiliateClick.belongsTo(AffiliateLink, {
  as: "AffiliateLink",
  foreignKey: "linkId",
});
AffiliateLink.hasMany(AffiliateClick, {
  as: "AffiliateClicks",
  foreignKey: "linkId",
});

// AffiliateUser and AffiliateTelegram relationship
AffiliateUser.hasMany(AffiliateTelegramLink, {
  as: "AffiliateTelegramLinks",
  foreignKey: "userId",
});

AffiliateTelegramLink.belongsTo(AffiliateUser, {
  foreignKey: "userId",
  constraints: false,
});

// Staff and AffiliateTelegram relationship
Staff.hasMany(AffiliateTelegramLink, {
  as: "AffiliateTelegramLinks",
  foreignKey: "userId",
});

AffiliateTelegramLink.belongsTo(Staff, {
  foreignKey: "userId",
  constraints: false, // Allow polymorphism
});

// User and AffiliateTelegram relationship
User.hasMany(AffiliateTelegramLink, {
  as: "AffiliateTelegramLinks",
  foreignKey: "userId",
});

AffiliateTelegramLink.belongsTo(User, {
  foreignKey: "userId",
  constraints: false,
});

// AffiliateUser relationship
AffiliateUser.hasMany(Postback, {
  as: "AffiliatePostbacks",
  foreignKey: "affiliateId",
});

Postback.belongsTo(AffiliateUser, {
  foreignKey: "affiliateId",
});

// AffiliateLink relationship
AffiliateLink.hasMany(Postback, {
  as: "Postbacks",
  foreignKey: "linkId",
});

Postback.belongsTo(AffiliateLink, {
  foreignKey: "linkId",
});

// Polymorphic relationship for traderId (User or AffiliateUser)
User.hasMany(Postback, {
  as: "UserPostbacks",
  foreignKey: "trader_id",
  constraints: false,
});

Postback.belongsTo(User, {
  foreignKey: "trader_id",
  constraints: false,
});

AffiliateUser.hasMany(Postback, {
  as: "AffiliateTraderPostbacks",
  foreignKey: "trader_id",
  constraints: false,
});

Postback.belongsTo(AffiliateUser, {
  foreignKey: "trader_id",
  constraints: false,
});
