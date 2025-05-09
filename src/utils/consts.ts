export const messages = {
  DB_CONNECTED: "Database has been connected successfully.",
  SERVER_FAILED_TO_START: "Failed to start server",
  OK: "Request successful.",
  SERVER_STARTED: "Server have been successfully started",
  PHONE_INUSE: "The phone number you provided has been taken.",
  SERVER_ERROR: "Sorry an internal server error occurred, please try again.",
  ACCOUNT_CREATED: "Account has been successfully created.",
  ACCOUNT_DELETED: "Account has been successfully deleted.",
  ACCOUNT_RESTORED: "Account has been successfully restored.",
  UNAUTHORIZED: "Unauthorized request.",
  INVALID_OTP: "The OTP you provided is invalid.",
  OTP_VERIFIED: "OTP has successfully verified.",
  PHONE_NOT_VERIFIED: "Phone number has been validated.",
  DETAILS_UPDATED: "Account details have been successfully updated.",
  NOT_FOUND: "Resource not found",
  OTP_RESENT: "Otp has been successfully resent.",
  PIN_CREATED: "Your pin has been successfully created.",
  LOGIN_SUCCESSFUL: "Login was successful.",
  ID_ALREADY_VERIFIED: "You have already verified your Id.",
  FAILED_TO_VERIFY_ID:
    "Failed to verify your id, please check the information you provided",
  ID_VERIFIED: "Id has been successfully verified.",
  ID_REQUIRED: "Id front and back are required.",
  USER_NOT_FOUND: "User not found.",
  USER_FOUND: "User found.",
  USER_ALREADY_EXIST: "User already exists.",
  USER_UPDATED: "User details have been successfully updated.",
  USER_NOT_ACTIVE: "User is not active.",
  USER_NOT_EXISTS: "User does not exist.",
  USER_NOT_ADMIN: "User is not an admin.",
  RESEND_TO_EARLY:
    "You cannot send an otp at this time because the interval between now and your last otp is too low.",
  OTP_EXPIRED:
    "The otp you provided has expired, please request for a new otp to continue.",
  INVALID_LOGIN_CRED: "Invalid login credentials provided, ",
  FORBIDDEN: "Access forbidden.",
  NETWORK_ERROR: "Network error occurred.",
  ONLY_LIVE: "This resource is only allowed in live mode",
  ONLY_DEMO: "This resource is only allowed in demo mode",
  INVALID_TICKER:
    "Invalid ticker selected, please confirm that the ticker you selected is valid, then try again.",
  ACCOUNT_SUSPENDED: "Your account has been suspended, please contact admin.",
  INVALID_EXPIRATION_TIME: "Invalid expiration time provided.",
  ORDER_PLACED: "Successfully registered an option contract.",
  ORDER_REWARDED: "Option contracted has been successfully evaluated.",
  INTERNAL_SERVER_ERROR: "An internal server error occurred",
  INVALID_PAGINATION: "Invalid pagination parameters provided.",
  INVALID_CATEGORY: "Invalid category selected.",
  FAQ_ALREADY_CREATED: "Faq has already been created.",
  CANT_PLACE_TRADE_RN: "You cannot place a trade for this pair at this time.",

  // Affiliate Users
  OTP_EMAIL_SUBJECT: "Your OTP Code",
  VERIFICATION_EMAIL_SUBJECT: "Email Verification Code",
  SIGNUP_SUCCESS:
    "Signup successful, please check your email for the verification code.",
  SIGNUP_FAILED: "Signup failed, please try again later.",
  SIGNIN_SUCCESS: "Signin successful.",
  SIGNIN_FAILED: "Signin failed, please check your credentials.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  INVALID_VERIFICATION_CODE: "Invalid verification code.",
  OTP_SENT: "OTP has been sent to your email.",
  OTP_STILL_VALID: "Your OTP is still valid. Please check your email.",
  PASSWORD_CHANGED: "Your password has been changed successfully.",
  PASSWORDS_DO_NOT_MATCH: "The passwords do not match. Please try again.",
  LOGOUT_FAILED: "Logout failed, please try again later.",
  EMAIL_VERIFIED: "Email verified successfully.",
  EMAIL_SEND_FAILURE: "Failed to send email",
  EMAIL_SENT_SUCCESS: "Email sent successfully",
  OTPS_CLEANED: "Expired OTPs have been cleaned up.",
  VERIFICATION_CODE_EXPIRED:
    "Your verification code has expired. A new code has been sent to your email.",
  ACCOUNT_NOT_VERIFIED:
    "Your account is not verified. Please check your email for the verification code.",
  ACCOUNT_ALREADY_VERIFIED: "Your account is already verified.",
  VERIFICATION_CODE_RESENT:
    "A new verification code has been sent to your email.",
  VERIFICATION_CODE_STILL_VALID:
    "Your verification code is still valid. Please check your email.",
  DUPLICATE_SECTION: "The section has already been created.",
  DUPLICATE_DATA: "Duplicate data.",
  INVALID_REFRESH_TOKEN: "The refresh token is invalid or expired.",
  INVALID_ACCESS_TOKEN: "The access token is invalid.",
  REFRESH_TOKEN_NOT_FOUND: "No active refresh token found for this user.",
  TOKEN_REFRESH_SUCCESS: "Tokens refreshed successfully.",
  SESSION_EXPIRED: "Your session has expired, please login again.",
  INVALID_REFERRAL_CODE: "Invalid referral code.",

  PROMO_CODE_ALREADY_EXISTS: "The promo code already exists.",
  PROMO_CODE_CREATED: "Promo code created successfully.",
  PROMO_CODE_UPDATED: "Promo code updated successfully.",
  PROMO_CODE_DELETED: "Promo code deleted successfully.",
  PROMO_CODE_NOT_FOUND: "Promo code not found.",
  PROMO_CODE_EXPIRED_OR_INACTIVE: "Promo code is expired or inactive.",
  PROMO_CODE_LIMIT_REACHED: "Promo code usage limit reached.",
  PROMO_CODE_VALID: "Promo code is valid.",

  AFFILIATE_LINK_NOT_FOUND: "Affiliate link not found.",
  INVALID_AFFILIATE_PROGRAM: "Affiliate program is invalid.",

  LINK_TYPE_ALREADY_EXISTS: "Link type already exists.",
  LINK_TYPE_CREATED: "Link type created successfully",
  LINK_TYPE_NOT_FOUND: "Link type not found.",
  LINK_TYPE_DELETED: "Link type deleted successfully.",
  LINK_TYPE_VALID: "Link type is valid.",
  INVALID_LINK_TYPE: "Link type is invalid.",

  AFFILIATE_PROGRAM_ALREADY_EXISTS: "Affiliate program already exists.",
  AFFILIATE_PROGRAM_CREATED: "Affiliate program created successfully",
  AFFILIATE_PROGRAM_NOT_FOUND: "Affiliate program not found.",
  AFFILIATE_PROGRAM_DELETED: "Affiliate program deleted successfully.",
  AFFILIATE_PROGRAM_VALID: "Affiliate program is valid.",

  CLICK: "Link click recorded successfully.",
  CLICK_NOT_RECORDED: "Click not recorded successfully.",
  CLICK_NOT_FOUND: "Click not found.",
  REFERRED_USER: "Referred a user successfully.",

  ACTIVITY_NOT_FOUND: "Activity not found.",

  TELEGRAM_LINK_CREATED: "Your Telegram account has been successfully linked!",
  TELEGRAM_LINK_DELETE: "Your Telegram account has been successfully unlinked!",
  TELEGRAM_LINK_ALREADY_EXISTS: "Your Telegram account is already linked.",
  TELEGRAM_LINK_GREETINGS:
    "I will be helping you link your Telegram account. Stay online until the process is completed.",
  TELEGRAM_LINK_CREATION_IN_PROGRESS:
    "Your Telegram account linking process initiated. Provide this link to the user.",
  TELEGRAM_LINK_NOT_FOUND:
    "Your Telegram account linking is currently in progress.",

  // ACTIVITIES
  REGISTRATION_SUCCESS: "You have registered successfully.",
  LOGIN_SUCCESS: "You have logged in successfully.",
  LOGOUT_SUCCESS: "You have logged out successfully.",
  PASSWORD_CHANGE_SUCCESS: "Your password was changed successfully.",
  PROFILE_UPDATE_SUCCESS: "Your profile has been updated successfully.",
  LINK_SHARE_SUCCESS: "You have shared the link successfully.",
  REFERRAL_REGISTRATION_SUCCESS: "You successfully referred a new user.",
  AFFILIATE_LINK_CLICK: "An affiliate link was clicked.",
  PURCHASE_SUCCESS: "Your purchase was completed successfully.",
  ACCOUNT_DELETION_REQUEST: "Your account deletion request has been received.",
  SESSION_TIMEOUT: "Your session has timed out due to inactivity.",
  FAILED_LOGIN_ATTEMPT:
    "There was an unsuccessful login attempt on your account.",
  EMAIL_VERIFICATION_SUCCESS: "Your email has been verified successfully.",
  TWO_FACTOR_SETUP_SUCCESS: "Two-factor authentication has been set up.",
  PAYMENT_FAILED: "Attempt to make payment failed, please try again.",
  PAYOUT_FAILED: "Attempt to initialize payout failed, please try again.",
  INSUFFICIENT_BALANCE: "Insufficient balance, please fund wallet to continue.",

  FILE_DELETED: "File deleted successfully",
  FILE_NOT_FOUND: "File not found",
};

export enum user_roles {
  user = "user",
  affiliate = "affiliate",
  admin = "admin",
}

export enum otp_types {
  verify_email = "verify_email",
  verify_phone = "verify_phone",
  reset_password = "reset_password",
}

export enum staff_otp_types {
  reset_password = "reset_password",
}

export enum otp_destination {
  email = "email",
  sms = "sms",
}

export enum bucket_folders {
  profile_pics = "profile_pics",
  content_docs = "content_docs",
  promotional_materials_section_thumbnails = "promotional_materials_section_thumbnails",
  promotional_materials_media = "promotional_materials_media",
  kyc_documents = "kyc_documents",
}

export enum ws_request_types {
  auth = "auth",
  subscribe = "subscribe",
  place_order = "place_order",
  affiliate_clicks_stats = "affiliate_clicks_stats",
  affiliate_clicks_subscribe = "affiliate_clicks_subscribe",
  registrations = "registrations",
  affiliate_activities = "affiliate_activities",
  affiliate_revenue_share = "affiliate_revenue_share",
  affiliate_turnover_share = "affiliate_turnover_share",
  affiliate_sub_affiliate = "affiliate_sub_affiliate",
  affiliate_top_affiliates = "affiliate_top_affiliates",
  affiliate_registration_stats = "affiliate_registration_stats",
}

export enum kafka_topics {
  options = "options_data",
  evaluate_contract = "evaluate_contract",
  clicks = "click-tracking",
  registrations = "registration-tracking",
  affiliate_activities = "affiliate-activities-tracking",
}

export enum polygon_response_types {
  connected = "connected",
  authed = "auth_success",
  auth_timeout = "auth_timeout",
  auth_failed = "auth_failed",
}

export enum polygon_actions {
  auth = "auth",
  subscribe = "subscribe",
}

export enum ws_response_types {
  authed = "authed",
  options = "options_data",
  subscribed = "subscribed",
  order_placed = "order_placed",
  order_failed = "order_failed",
  order_rewarded = "order_rewarded",
  affiliate_activity = "affiliate-activity",
  affiliate_revenue_share = "affiliate-revenue-share",
  affiliate_turnover_share = "affiliate-turnover-share",
  affiliate_sub_affiliate = "affiliate-sub-affiliate",
  affiliate_top_affiliates = "affiliate-top-affiliates",
  click_subscription = "click_subscription",
  click_update = "click_update",
  ticker_subscription_history = "ticker_subscription_history",
}

export enum affiliate_activities_types {
  signup = "registration",
  signin = "sign_in",
  signout = "sign_out",
  click = "click",
  verifyEmail = "verify_email",
  verifyOtp = "verify_otp",
  resetPassword = "reset_password",
  updateProfile = "update_profile",
  referredUser = "referred_user",
  affiliateLinkClick = "affiliate_link_click",
}

export enum request_methods {
  post = "POST",
  get = "GET",
}

export enum polygon_endpoints {
  tickers = "/v3/reference/tickers",
  agg_history = "/v2/aggs/ticker/",
}

export enum transaction_type {
  debit = "debit",
  credit = "credit",
  payout = "payout",
}

export enum transaction_statuses {
  completed = "completed",
  pending = "pending",
  failed = "failed",
  errored = "errored",
}

export enum order_prediction_types {
  higher = "higher",
  lower = "lower",
}

export enum order_statuses {
  waiting = "waiting",
  evaluated = "evaluated",
}

export enum staff_actions {
  create = "create",
  update = "update",
  delete = "delete",
}

export enum listing_order {
  asc = "asc",
  desc = "desc",
}

export enum content_user_categories {
  traders = "traders",
  affiliates = "affiliates",
}

export enum content_categories {
  privacy_policy = "Privacy Policy",
  risk_disclosure = "Risk Disclosure",
  payment_policy = "Payment Policy",
  regulation_of_trading_operation = "Regulation of Trading Operation",
  regulation_of_non_trading_operation = "Non-Trading Operation Regulation",
  service_agreement = "Service Agreement",
  terms_and_condition = "Terms and Condition",
}

export enum promotional_material_section_types {
  banner = "Banner",
  landings = "Landings",
  videos = "Videos",
  logos = "Logos",
}

export enum promotional_material_types {
  image = "Image",
  video = "Video",
}

export enum setting_keys {
  trade_buy_commission = "trade_buy_commission",
  trade_sell_commission = "trade_sell_commission",
  deposit_limit = "deposit_limit",
  withdrawal_limit = "withdrawal_limit",
  trade_limit = "trade_limit",
  e_wallet_deposit_limit = "e_wallet_deposit_limit",
  e_wallet_withdrawal_limit = "e_wallet_withdrawal_limit",
  bank_transfer_deposit_limit = "bank_transfer_deposit_limit",
  bank_transfer_withdrawal_limit = "bank_transfer_withdrawal_limit",
  traders_payout_schedule_e_wallet = "traders_payout_schedule_e_wallet",
  traders_payout_schedule_bank_transfer = "traders_payout_schedule_bank_transfer",
  traders_payout_schedule_debit_credit_card = "traders_payout_schedule_debit_credit_card",
  traders_payout_schedule_crypto = "traders_payout_schedule_crypto",
  affiliate_payout_schedule = "affiliate_payout_schedule",
  system_currency = "system_currency",
  password_min_length = "password_min_length",
  password_complexity = "password_complexity",
  login_max_attempt = "login_max_attempt",
  login_session_timeout = "login_session_timeout",
  profit_outcome = "profit_outcome",
  win_loss_probability = "win_loss_probability",
  win_loss_threshold = "win_loss_threshold",
}
export enum trade_pair_categories {
  stock = "stock",
  crypto = "crypto",
}

export enum nowpay_endpoints {
  auth = "/v1/auth",
  init_payment = "/v1/payment",
  estimate = "/v1/estimate",
  payout = "/v1/payout",
}
