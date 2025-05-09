import { Router } from "express";
import { authMiddleware } from "../../middlewares/Affiliate/Affiliate.Middleware";
import {
  GetUserClicksAndReferralsStatsController,
  GetUserReferralsStatsController,
  createActivityController,
  deleteActivityController,
  getActivityByIdController,
  getAllActivitiesController,
  updateActivityController,
} from "../../controllers/Affiliate/AffiliateUserActivity.Controller";
import { GetUserClicksController } from "../../controllers/Affiliate/AffiliateClicks.Controller";

const AffiliateActivityRouter = Router();

// Route to create a new activity
AffiliateActivityRouter.post(
  "/",
  authMiddleware,
  createActivityController
  /*
    #swagger.tags = ['Affiliate Tracking Services - User Activities']
    #swagger.description = "Creates a new activity record. The activity can be one of the following types: SIGN_IN, SIGN_UP, PASSWORD_CHANGE, ACCOUNT_VERIFICATION, REFERRAL, LOGOUT. Each activity type represents a distinct user action within the affiliate tracking system."
    #swagger.parameters['body'] = { 
      in: 'body', 
      required: true, 
      schema: { 
        $ref: '#/definitions/CreateActivityPayload' 
      } 
    }
    #swagger.responses[201] = {
      description: "Activity record successfully created.",
      schema: { $ref: '#/definitions/CreateActivityResponse' }
    }
    #swagger.responses[400] = {
      description: "Bad Request. This response indicates that the provided data is invalid or missing required fields.",
      schema: { $ref: '#/definitions/BadRequest' }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error. An unexpected error occurred while processing the request.",
      schema: { $ref: '#/definitions/InternalServerError' }
    }
    #swagger.responses[401] = {
      description: "Unauthorized. The request lacks valid authentication credentials.",
      schema: { $ref: '#/definitions/Unauthorized' }
    }
    #swagger.responses[403] = {
      description: "Forbidden. The user does not have permission to perform this action.",
      schema: { $ref: '#/definitions/Forbidden' }
    }
   */
);

// Route to get all activities
AffiliateActivityRouter.get(
  "/",
  authMiddleware,
  getAllActivitiesController
  /*
    #swagger.tags = ['Affiliate Tracking Services - User Activities']
    #swagger.description = "Fetches a list of all activities."

    #swagger.parameters['page'] = {
      in: 'query',
      required: false,
      type: 'integer',
      description: "The page number to fetch (1-based index). Defaults to 1.",
      example: 1
    }
    
    #swagger.parameters['size'] = {
      in: 'query',
      required: false,
      type: 'integer',
      description: "The number of records to fetch per page. Defaults to 10.",
      example: 10
    }

    #swagger.parameters['searchQuery'] = {
      in: 'query',
      required: false,
      type: 'string',
      description: "Optional search term to filter results by activity fields.",
      example: "login"
    }

    #swagger.parameters['accessToken'] = {
      in: 'header',
      required: false,
      type: 'string',
      description: 'Access token for authentication (optional).'
    }

    #swagger.parameters['refreshToken'] = {
      in: 'header',
      required: false,
      type: 'string',
      description: 'Refresh token for authentication (optional).'
    }
    
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/GetAllActivitiesResponse' }
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

// Route to fetch user clicks grouped by date
AffiliateActivityRouter.get(
  "/clicks-stat",
  authMiddleware,
  GetUserClicksController
  /*
    #swagger.tags = ['Affiliate Tracking Services - Clicks and Referrals']
    #swagger.description = "Fetches user clicks grouped by date."
    
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/GetUserClicksResponse' }
    }

    #swagger.responses[401] = {
      description: "Unauthorized. The request lacks valid authentication credentials.",
      schema: { $ref: '#/definitions/Unauthorized' }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      schema: { $ref: '#/definitions/InternalServerError' }
    }
   */
);

// Route to fetch user referrals grouped by date
AffiliateActivityRouter.get(
  "/referrals-stat",
  authMiddleware,
  GetUserReferralsStatsController
  /*
    #swagger.tags = ['Affiliate Tracking Services - Clicks and Referrals']
    #swagger.description = "Fetches user referrals grouped by date."

    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/GetUserReferralsStatsResponse' }
    }
    
    #swagger.responses[401] = {
      description: "Unauthorized. The request lacks valid authentication credentials.",
      schema: { $ref: '#/definitions/Unauthorized' }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      schema: { $ref: '#/definitions/InternalServerError' }
    }
   */
);

// Route to fetch both user clicks and referrals grouped by date
AffiliateActivityRouter.get(
  "/clicks-and-referrals-stats",
  authMiddleware,
  GetUserClicksAndReferralsStatsController
  /*
    #swagger.tags = ['Affiliate Tracking Services - Clicks and Referrals']
    #swagger.description = "Fetches both user clicks and referrals grouped by date."
    
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/GetUserClicksAndReferralsStatsResponse' }
    }
    
    #swagger.responses[401] = {
      description: "Unauthorized. The request lacks valid authentication credentials.",
      schema: { $ref: '#/definitions/Unauthorized' }
    }
    #swagger.responses[500] = {
      description: "Internal Server Error",
      schema: { $ref: '#/definitions/InternalServerError' }
    }
   */
);

// Route to get an activity by ID
AffiliateActivityRouter.get(
  "/:id",
  authMiddleware,
  getActivityByIdController
  /*
    #swagger.tags = ['Affiliate Tracking Services - User Activities']
    #swagger.description = "Fetches an activity record by its ID."
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'ID of the activity record.' }
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/GetActivityByIdResponse' }
    }
    #swagger.responses[404] = {
      description: "Not Found",
      schema: { $ref: '#/definitions/NotFound' }
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

// Route to update an activity
AffiliateActivityRouter.put(
  "/:id",
  authMiddleware,
  updateActivityController
  /*
    #swagger.tags = ['Affiliate Tracking Services - User Activities']
    #swagger.description = "Updates an activity record by its ID. The activity can be one of the following types: SIGN_IN, SIGN_UP, PASSWORD_CHANGE, ACCOUNT_VERIFICATION, REFERRAL, LOGOUT. Each activity type represents a distinct user action within the affiliate tracking system."
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'ID of the activity record.' }
    #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/UpdateActivityPayload' } }
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/UpdateActivityResponse' }
    }
    #swagger.responses[400] = {
      description: "Bad Request",
      schema: { $ref: '#/definitions/BadRequest' }
    }
    #swagger.responses[404] = {
      description: "Not Found",
      schema: { $ref: '#/definitions/NotFound' }
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

// Route to delete an activity
AffiliateActivityRouter.delete(
  "/:id",
  authMiddleware,
  deleteActivityController
  /*
    #swagger.tags = ['Affiliate Tracking Services - User Activities']
    #swagger.description = "Deletes an activity record by its ID."
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'ID of the activity record.' }
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/DeleteActivityResponse' }
    }
    #swagger.responses[404] = {
      description: "Not Found",
      schema: { $ref: '#/definitions/NotFound' }
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

export default AffiliateActivityRouter;
