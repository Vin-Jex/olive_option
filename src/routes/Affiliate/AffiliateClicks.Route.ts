import { Router } from "express";
import {
  CreateAffiliateClickController,
  GetAllAffiliateClicksController,
  GetAffiliateClickByIdController,
  UpdateAffiliateClickController,
  DeleteAffiliateClickController,
} from "../../controllers/Affiliate/AffiliateClicks.Controller";

import { authMiddleware } from "../../middlewares/Affiliate/Affiliate.Middleware";

const AffiliateClickRouter = Router();

// Route to create a new affiliate click
AffiliateClickRouter.post(
  "/",
  CreateAffiliateClickController
  /*
    #swagger.tags = ['Affiliate Tracking Services - Link Clicks']
    #swagger.description = "Creates a new affiliate click record."
    #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/CreateAffiliateClickPayload' } }
    #swagger.responses[201] = {
      description: "Created",
      schema: { $ref: '#/definitions/CreateAffiliateClickResponse' }
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

// Route to get all affiliate clicks
AffiliateClickRouter.get(
  "/",
  authMiddleware,
  GetAllAffiliateClicksController
  /*
    #swagger.tags = ['Affiliate Tracking Services - Link Clicks']
    #swagger.description = "Fetches a list of all affiliate clicks."

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
      description: "Optional search term to filter results by affiliate link fields (e.g., link, comment, etc.).",
      example: "affiliate"
    }

    #swagger.parameters['sortBy'] = {
      in: 'query',
      required: false,
      type: 'string',
      description: "Optional field to sort the results by (e.g., created_at, link). Defaults to created_at.",
      example: "created_at"
    }

    #swagger.parameters['sortOrder'] = {
      in: 'query',
      required: false,
      type: 'string',
      enum: ['ASC', 'DESC'],
      description: "Optional sorting order: ASC for ascending, DESC for descending. Defaults to DESC.",
      example: "DESC"
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
      schema: { $ref: '#/definitions/GetAffiliateClicksResponse' }
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

// Route to get an affiliate click by ID
AffiliateClickRouter.get(
  "/:id",
  authMiddleware,
  GetAffiliateClickByIdController
  /*
    #swagger.tags = ['Affiliate Tracking Services - Link Clicks']
    #swagger.description = "Fetches an affiliate click record by its ID."
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'ID of the affiliate click record.' }
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/GetAffiliateClickByIdResponse' }
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

// Route to update an affiliate click
AffiliateClickRouter.put(
  "/:id",
  authMiddleware,
  UpdateAffiliateClickController
  /*
    #swagger.tags = ['Affiliate Tracking Services - Link Clicks']
    #swagger.description = "Updates an affiliate click record by its ID."
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'ID of the affiliate click record.' }
    #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/UpdateAffiliateClickPayload' } }
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/UpdateAffiliateClickResponse' }
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

// Route to delete an affiliate click
AffiliateClickRouter.delete(
  "/:id",
  authMiddleware,
  DeleteAffiliateClickController
  /*
    #swagger.tags = ['Affiliate Tracking Services - Link Clicks']
    #swagger.description = "Deletes an affiliate click record by its ID."
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'ID of the affiliate click record.' }
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/DeleteAffiliateClickResponse' }
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

export default AffiliateClickRouter;
