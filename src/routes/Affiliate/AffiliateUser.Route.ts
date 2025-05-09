import { Router } from "express";
import {
  CreateAffiliateUser,
  SigninAffiliateUser,
  LogoutAffiliateUser,
  VerifyEmailAffiliateUser,
  ResendVerificationCodeAffiliateUser,
  SendPasswordChangeOtpAffiliateUser,
  ChangePasswordAffiliateUser,
  RefreshTokenController,
  getPaginatedAffiliateUsers,
  getAffiliateUserById,
  DownloadAffiliateUsersCSV,
  GetUserReferralsController,
  VerifyOtpAffiliateUser,
  ResendOtpCodeAffiliateUser,
  validateReferralCodeController,
  GetAffiliateUserActivitiesController,
  CreateAffiliateUserActivityController,
  UpdateUserByIdController,
  FetchUserByIdController,
  FetchTopAffiliateUsersController,
  DeleteUserByIdController,
  RestoreUserAccountByIdController,
} from "../../controllers/Affiliate/AffiliateUser.Controller";
import { authMiddleware } from "../../middlewares/Affiliate/Affiliate.Middleware";
import { validateAffiliateId } from "../../middlewares/ValidateAffiliateId.Middleware";
import { adminOnly } from "../../middlewares/staff";

const AffiliateUserRouter = Router();

AffiliateUserRouter.post(
  "/signup",
  CreateAffiliateUser
  /*
    #swagger.tags = ['Affiliate Users']
    #swagger.description = "Creates a new affiliate user."
    #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateAffiliateUserPayload' } }
    #swagger.responses[201] = {
      description: "Created",
      schema: { $ref: '#/definitions/CreateAffiliateUserResponse' }
    }
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/BadRequest' }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      schema: { $ref: '#/definitions/InternalServerError' }
    }
    #swagger.responses[401] = {
      description: "Unauthorized",
      schema: { $ref: '#/definitions/Unauthorized' }
    }
    #swagger.responses[403] = {
      description: "Forbidden",
      schema: { $ref: '#/definitions/Forbidden' }
    }
   */
);

AffiliateUserRouter.post(
  "/signin",
  SigninAffiliateUser
  /*
    #swagger.tags = ['Affiliate Users']
    #swagger.description = "Authenticates an affiliate user and provides an access token."
    #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/SigninAffiliateUserPayload' } }
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/SigninAffiliateUserResponse' }
    }
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/BadRequest' }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      schema: { $ref: '#/definitions/InternalServerError' }
    }
    #swagger.responses[401] = {
      description: "Unauthorized",
      schema: { $ref: '#/definitions/Unauthorized' }
    }
    #swagger.responses[403] = {
      description: "Forbidden",
      schema: { $ref: '#/definitions/Forbidden' }
    }
   */
);

AffiliateUserRouter.post(
  "/logout",
  LogoutAffiliateUser
  /*
    #swagger.tags = ['Affiliate Users']
    #swagger.description = "Logs out an affiliate user by invalidating the token."
    #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/LogoutAffiliateUserPayload' } }
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/LogoutAffiliateUserResponse' }
    }
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/BadRequest' }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      schema: { $ref: '#/definitions/InternalServerError' }
    }
    #swagger.responses[401] = {
      description: "Unauthorized",
      schema: { $ref: '#/definitions/Unauthorized' }
    }
    #swagger.responses[403] = {
      description: "Forbidden",
      schema: { $ref: '#/definitions/Forbidden' }
    }
   */
);

AffiliateUserRouter.post(
  "/verify-email",
  VerifyEmailAffiliateUser
  /*
    #swagger.tags = ['Affiliate Users']
    #swagger.description = "Verifies an affiliate user's email using a verification code."
    #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/VerifyEmailAffiliateUserPayload' } }
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/VerifyEmailAffiliateUserResponse' }
    }
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/BadRequest' }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      schema: { $ref: '#/definitions/InternalServerError' }
    }
    #swagger.responses[401] = {
      description: "Unauthorized",
      schema: { $ref: '#/definitions/Unauthorized' }
    }
    #swagger.responses[403] = {
      description: "Forbidden",
      schema: { $ref: '#/definitions/Forbidden' }
    }
   */
);

AffiliateUserRouter.post(
  "/verify-otp",
  VerifyOtpAffiliateUser
  /*
    #swagger.tags = ['Affiliate Users']
    #swagger.description = "Verifies an affiliate user's OTP using a verification code."
    #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/VerifyOtpAffiliateUserPayload' } }
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/VerifyOtpAffiliateUserResponse' }
    }
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/BadRequest' }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      schema: { $ref: '#/definitions/InternalServerError' }
    }
    #swagger.responses[401] = {
      description: "Unauthorized",
      schema: { $ref: '#/definitions/Unauthorized' }
    }
    #swagger.responses[403] = {
      description: "Forbidden",
      schema: { $ref: '#/definitions/Forbidden' }
    }
   */
);

AffiliateUserRouter.post(
  "/resend-verification-code",
  ResendVerificationCodeAffiliateUser
  /*
    #swagger.tags = ['Affiliate Users']
    #swagger.description = "Resends a verification code to the provided email for account verification."
    #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/ResendVerificationCodeAffiliateUserPayload' } }
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/ResendVerificationCodeAffiliateUserResponse' }
    }
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/BadRequest' }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      schema: { $ref: '#/definitions/InternalServerError' }
    }
    #swagger.responses[401] = {
      description: "Unauthorized",
      schema: { $ref: '#/definitions/Unauthorized' }
    }
    #swagger.responses[403] = {
      description: "Forbidden",
      schema: { $ref: '#/definitions/Forbidden' }
    }
   */
);
// ResendOtpCodeAffiliateUser;
AffiliateUserRouter.post(
  "/resend-otp-code",
  ResendOtpCodeAffiliateUser
  /*
    #swagger.tags = ['Affiliate Users']
    #swagger.description = "Resends a verification code to the provided email for password reset."
    #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/ResendVerificationCodeAffiliateUserPayload' } }
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/ResendVerificationCodeAffiliateUserResponse' }
    }
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/BadRequest' }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      schema: { $ref: '#/definitions/InternalServerError' }
    }
    #swagger.responses[401] = {
      description: "Unauthorized",
      schema: { $ref: '#/definitions/Unauthorized' }
    }
    #swagger.responses[403] = {
      description: "Forbidden",
      schema: { $ref: '#/definitions/Forbidden' }
    }
   */
);

AffiliateUserRouter.post(
  "/send-password-otp",
  SendPasswordChangeOtpAffiliateUser
  /*
    #swagger.tags = ['Affiliate Users']
    #swagger.description = "Sends a one-time password (OTP) to the user for password change."
    #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/SendPasswordChangeOtpAffiliateUserPayload' } }
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/SendPasswordChangeOtpAffiliateUserResponse' }
    }
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/BadRequest' }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      schema: { $ref: '#/definitions/InternalServerError' }
    }
    #swagger.responses[401] = {
      description: "Unauthorized",
      schema: { $ref: '#/definitions/Unauthorized' }
    }
    #swagger.responses[403] = {
      description: "Forbidden",
      schema: { $ref: '#/definitions/Forbidden' }
    }
   */
);

AffiliateUserRouter.post(
  "/change-password",
  ChangePasswordAffiliateUser
  /*
    #swagger.tags = ['Affiliate Users']
    #swagger.description = "Changes the user's password using the OTP and new password."
    #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/ChangePasswordAffiliateUserPayload' } }
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/ChangePasswordAffiliateUserResponse' }
    }
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/BadRequest' }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      schema: { $ref: '#/definitions/InternalServerError' }
    }
    #swagger.responses[401] = {
      description: "Unauthorized",
      schema: { $ref: '#/definitions/Unauthorized' }
    }
    #swagger.responses[403] = {
      description: "Forbidden",
      schema: { $ref: '#/definitions/Forbidden' }
    }
   */
);

AffiliateUserRouter.post(
  "/refresh-token",
  RefreshTokenController
  /*
    #swagger.tags = ['Affiliate Users']
    #swagger.description = "Refreshes the access token using the provided refresh token."
    #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/RefreshTokenAffiliateUserPayload' } }
    #swagger.responses[200] = { description: "OK", schema: { $ref: '#/definitions/RefreshTokenAffiliateUserResponse' } }
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/BadRequest' }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      schema: { $ref: '#/definitions/InternalServerError' }
    }
    #swagger.responses[401] = {
      description: "Unauthorized",
      schema: { $ref: '#/definitions/Unauthorized' }
    }
    #swagger.responses[403] = {
      description: "Forbidden",
      schema: { $ref: '#/definitions/Forbidden' }
    }
   */
);

// Route to get a paginated list of affiliate users
AffiliateUserRouter.get(
  "/paginated",
  authMiddleware,
  getPaginatedAffiliateUsers
  /*
    #swagger.tags = ['Affiliate Admin Management']
    #swagger.description = "Fetches a paginated list of affiliate users with optional filtering and sorting."
    #swagger.parameters['page'] = { in: 'query', required: false, type: 'integer', description: 'The page number to retrieve (1-based index).' }
    #swagger.parameters['size'] = { in: 'query', required: false, type: 'integer', description: 'The number of records to retrieve per page.' }
    #swagger.parameters['filters'] = { 
      in: 'query', 
      required: false, 
      type: 'object', 
      description: 'Optional filters for the results. Expected structure: { active: boolean, searchQuery: string, sortBy: string, sortOrder: string, tier_level: string, total_referrals: number }' 
    }
    #swagger.responses[200] = { description: "OK", schema: { $ref: '#/definitions/GetPaginatedAffiliateUsersResponse' } }
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/BadRequest' }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      schema: { $ref: '#/definitions/InternalServerError' }
    }
    #swagger.responses[401] = {
      description: "Unauthorized",
      schema: { $ref: '#/definitions/Unauthorized' }
    }
    #swagger.responses[403] = {
      description: "Forbidden",
      schema: { $ref: '#/definitions/Forbidden' }
    }
  */
);

// Route to download affiliate users as a CSV
AffiliateUserRouter.get(
  "/download-csv",
  authMiddleware,
  DownloadAffiliateUsersCSV
  /*
    #swagger.tags = ['Affiliate Admin Management']
    #swagger.description = "Downloads a CSV file containing affiliate users based on paginated or filtered query results."
    #swagger.parameters['page'] = { 
      in: 'query', 
      required: false, 
      type: 'integer', 
      description: 'The page number to retrieve (1-based index).' 
    }
    #swagger.parameters['size'] = { 
      in: 'query', 
      required: false, 
      type: 'integer', 
      description: 'The number of records to retrieve per page.' 
    }
    #swagger.parameters['filters'] = { 
      in: 'query', 
      required: false, 
      type: 'object', 
      description: 'Optional filters for the results. Expected structure: { active: boolean, searchQuery: string, sortBy: string, sortOrder: string, tier_level: string, total_referrals: number }' 
    }
    #swagger.responses[200] = {
      description: "OK",
      schema: {
        type: "string",
        description: 'The CSV file of affiliate users.',
        format: "binary",
        example: `id,full_name,email,referral_code,is_active,is_verified,verification_code,last_login,tier_level,total_referrals,referral_code,country,date_of_birth,phone_number,created_at,updated_at
          2,John Doe,johndoe@example.com,,true,false,6165,,1,0,REF123,,null,null,null,2024-10-20T01:38:45.901Z,2024-10-20T01:38:45.901Z
          4,Bob Johnson,bob@example.com,,false,false,5678,,1,2,REF456,Canada,1992-11-30,555-5678,2024-10-20T01:38:45.901Z,2024-10-20T01:38:45.901Z
        `
      }
    }
    #swagger.responses[400] = { 
      description: "Bad Request", 
      schema: { $ref: '#/definitions/BadRequest' } 
    }
    #swagger.responses[500] = { 
      description: "Internal Server Error", 
      schema: { $ref: '#/definitions/InternalServerError' } 
    }
    #swagger.responses[401] = { 
      description: "Unauthorized", 
      schema: { $ref: '#/definitions/Unauthorized' } 
    }
    #swagger.responses[403] = { 
      description: "Forbidden", 
      schema: { $ref: '#/definitions/Forbidden' } 
    }
  */
);

/**
 * Route to fetch a user by ID.
 */
AffiliateUserRouter.get(
  "/me",
  authMiddleware,
  FetchUserByIdController
  /*
    #swagger.tags = ['Affiliate Users']
    #swagger.description = "Fetch the logged-in user's information."
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/AffiliateUserResponse' }
    }
    #swagger.responses[404] = {
      description: "User Not Found",
      schema: { $ref: '#/definitions/NotFound' }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      schema: { $ref: '#/definitions/InternalServerError' }
    }
  */
);

/**
 * Route to update the logged-in user's information.
 */
AffiliateUserRouter.put(
  "/me",
  authMiddleware,
  UpdateUserByIdController
  /*
    #swagger.tags = ['Affiliate Users']
    #swagger.description = "Update the logged-in user's information."
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: '#/definitions/UpdateAffiliateUserRequest' }
        }
      }
    }
    #swagger.responses[200] = {
      description: "User Updated Successfully",
      schema: { $ref: '#/definitions/AffiliateUserResponse' }
    }
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/BadRequest' }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      schema: { $ref: '#/definitions/InternalServerError' }
    }
  */
);

/**
 * Route to delete a user account
 */
AffiliateUserRouter.delete(
  "/me",
  authMiddleware,
  DeleteUserByIdController
  /*
    #swagger.tags = ['Affiliate Users']
    #swagger.description = "Delete an authorized user account."
    #swagger.responses[204] = {
      description: "User Account Deleted Successfully."
    }
    #swagger.responses[400] = {
      description: "NotFound",
      schema: { $ref: '#/definitions/NotFound' }
    }
    #swagger.responses[401] = {
      description: "Unauthorized",
      schema: { $ref: '#/definitions/Unauthorized' }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      schema: { $ref: '#/definitions/InternalServerError' }
    }
  */
);

/**
 * Route to restore a deleted user account
 */
AffiliateUserRouter.post(
  "/restore/:id",
  adminOnly,
  RestoreUserAccountByIdController
  /*
    #swagger.tags = ['Affiliate Admin Management']
    #swagger.description = "Restore a deleted user account by ID."
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: 'The ID of the user to restore.'
    }
    #swagger.responses[200] = {
      description: "User Account Restored Successfully",
      schema: { $ref: '#/definitions/CreateAffiliateUserResponse' }
    }
    #swagger.responses[400] = {
      description: "NotFound",
      schema: { $ref: '#/definitions/NotFound' }
    }
    #swagger.responses[401] = {
      description: "Unauthorized",
      schema: { $ref: '#/definitions/Unauthorized' }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      schema: { $ref: '#/definitions/InternalServerError' }
    }
    */
);

/**
 * Route to fetch the top 10 affiliate users based on tier level and total referrals.
 */
AffiliateUserRouter.get(
  "/top-affiliates",
  authMiddleware,
  FetchTopAffiliateUsersController
  /*
    #swagger.tags = ['Affiliate Users']
    #swagger.description = "Fetch the top 10 affiliate users based on tier level and total referrals."
    #swagger.responses[200] = {
      description: "Top Affiliates Fetched Successfully",
      schema: { $ref: '#/definitions/TopAffiliateUsersResponse' }
    }
    #swagger.responses[401] = {
      description: "Unauthorized",
      schema: { $ref: '#/definitions/Unauthorized' }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      schema: { $ref: '#/definitions/InternalServerError' }
    }
  */
);

/**
 * Route to create an affiliate user activity.
 */
AffiliateUserRouter.post(
  "/activities",
  authMiddleware,
  CreateAffiliateUserActivityController
  /*
    #swagger.tags = ['Affiliate User Activities']
    #swagger.description = "Create a new activity for the logged-in user. This is for the authenticated users only."
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: '#/definitions/CreateAffiliateActivityRequest' }
        }
      }
    }
    #swagger.responses[201] = {
      description: "Activity Created Successfully",
      schema: { $ref: '#/definitions/AffiliateActivityResponse' }
    }
    #swagger.responses[400] = {
      description: "Validation Error",
      schema: { $ref: '#/definitions/BadRequest' }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      schema: { $ref: '#/definitions/InternalServerError' }
    }
  */
);

/**
 * Route to retrieve affiliate user activities with filters.
 */
AffiliateUserRouter.get(
  "/activities",
  authMiddleware,
  GetAffiliateUserActivitiesController
  /*
    #swagger.tags = ['Affiliate User Activities']
    #swagger.description = "Retrieve the activities for the logged-in user, with optional filters."
    #swagger.parameters['activityType'] = {
      in: 'query',
      required: false,
      type: 'string',
      description: "The type of activity to filter by. The activity type can be one of the following types: sign_in, sign_up, password_change, account_verification, referral_signup, logout. Each activity type represents a distinct user action within the affiliate tracking system."
    }
    #swagger.parameters['startDate'] = {
      in: 'query',
      required: false,
      type: 'string',
      format: 'date-time',
      description: "Start date to filter activities."
    }
    #swagger.parameters['endDate'] = {
      in: 'query',
      required: false,
      type: 'string',
      format: 'date-time',
      description: "End date to filter activities."
    }
    #swagger.parameters['page'] = {
      in: 'query',
      required: false,
      type: 'integer',
      description: "The page number to retrieve."
    }
    #swagger.parameters['limit'] = {
      in: 'query',
      required: false,
      type: 'integer',
      description: "The number of records per page."
    }
    #swagger.responses[200] = {
      description: "Activities Retrieved Successfully",
      schema: { $ref: '#/definitions/GetAllAffiliateActivitiesResponse' }
    }
    #swagger.responses[400] = {
      description: "Validation Error",
      schema: { $ref: '#/definitions/BadRequest' }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      schema: { $ref: '#/definitions/InternalServerError' }
    }
  */
);

// Route to fetch paginated referrals for a user by user ID
AffiliateUserRouter.get(
  "/:id/referrals",
  authMiddleware,
  GetUserReferralsController
  /*
    #swagger.tags = ['Affiliate Admin Management']
    #swagger.description = "Fetches paginated referrals for a user by user ID."
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: 'The ID of the user to fetch referrals for.'
    }
    #swagger.parameters['page'] = {
      in: 'query',
      required: false,
      type: 'integer',
      description: 'The page number to retrieve (1-based index).',
      default: 1
    }
    #swagger.parameters['size'] = {
      in: 'query',
      required: false,
      type: 'integer',
      description: 'The number of records to retrieve per page.',
      default: 10
    }
    #swagger.parameters['tokens'] = {
      in: 'header',
      required: false,
      description: 'Authentication tokens.',
      schema: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          refreshToken: { type: 'string' },
        }
      }
    }
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/GetPaginatedUserReferralsResponse' }
    }
    #swagger.responses[400] = { 
      description: "Bad Request", 
      schema: { $ref: '#/definitions/BadRequest' } 
    }
    #swagger.responses[500] = { 
      description: "Internal Server Error", 
      schema: { $ref: '#/definitions/InternalServerError' } 
    }
    #swagger.responses[401] = { 
      description: "Unauthorized", 
      schema: { $ref: '#/definitions/Unauthorized' } 
    }
    #swagger.responses[403] = { 
      description: "Forbidden", 
      schema: { $ref: '#/definitions/Forbidden' } 
    }
  */
);

// Route to get an affiliate user by ID
AffiliateUserRouter.get(
  "/:id",
  authMiddleware,
  validateAffiliateId,
  getAffiliateUserById
  /*
    #swagger.tags = ['Affiliate Admin Management']
    #swagger.description = "Get an affiliate user by ID (requires authentication and validates ID)"
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'The ID of the affiliate user to retrieve.' }
    #swagger.responses[200] = { description: "OK", schema: { $ref: '#/definitions/GetAffiliateUserByIdResponse' } }
    #swagger.responses[404] = {
      description: "Not Found",
      schema: { $ref: '#/definitions/NotFound' }
    }
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/BadRequest' }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      schema: { $ref: '#/definitions/InternalServerError' }
    }
    #swagger.responses[401] = {
      description: "Unauthorized",
      schema: { $ref: '#/definitions/Unauthorized' }
    }
    #swagger.responses[403] = {
      description: "Forbidden",
      schema: { $ref: '#/definitions/Forbidden' }
    }
  */
);

AffiliateUserRouter.get(
  "/validate-referral/:referralCode",
  validateReferralCodeController
  /*
    #swagger.tags = ['Affiliate Users']
    #swagger.description = "Validates an affiliate referral code."
    #swagger.parameters['referralCode'] = {
      in: 'path',
      required: true,
      description: "The referral code to validate.",
      schema: { type: "string" }
    }
    #swagger.responses[200] = {
      description: "Referral ID is valid.",
      schema: { $ref: '#/definitions/ValidateReferralCodeResponse' }
    }
    #swagger.responses[400] = {
      description: "Invalid referral code or missing parameter.",
      schema: { $ref: '#/definitions/BadRequest' }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      schema: { $ref: '#/definitions/InternalServerError' }
    }
  */
);

export default AffiliateUserRouter;
