import { Router } from "express";
import {
  CreateAffiliateLinkController,
  GetAffiliateLinkByIdController,
  GetAllAffiliateLinksController,
  GetPaginatedAffiliateLinksController,
  UpdateAffiliateLinkController,
  DeleteAffiliateLinkController,
} from "../../controllers/Affiliate/Link.Controller";
import { authMiddleware } from "../../middlewares/Affiliate/Affiliate.Middleware";

const AffiliateLinkRoutes = Router();

// authMiddleware for all routes to protect them
AffiliateLinkRoutes.use(authMiddleware);

AffiliateLinkRoutes.post(
  "/",
  CreateAffiliateLinkController
  /*
  #swagger.tags = ['Affiliate - Links']
  #swagger.description = "Create a new affiliate link (requires authentication)"
  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    description: "Payload for creating a new affiliate link, including the link data and optional promo code.",
    schema: { $ref: '#/definitions/CreateAffiliateLinkPayload' }
  }
  #swagger.parameters['accessToken'] = {
    in: 'header',
    required: false,
    type: 'string',
    description: 'Access token for authentication'
  }
  #swagger.parameters['refreshToken'] = {
    in: 'header',
    required: false,
    type: 'string',
    description: 'Refresh token for authentication'
  }
  #swagger.responses[201] = {
    description: "Created",
    schema: { $ref: '#/definitions/CreateAffiliateLinkResponse' }
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

AffiliateLinkRoutes.get(
  "/",
  GetAllAffiliateLinksController
  /*
    #swagger.tags = ['Affiliate - Links']
    #swagger.description = "Get all affiliate links (requires authentication)"
    #swagger.parameters['accessToken'] = {
      in: 'header',
      required: false,
      type: 'string',
      description: 'Access token for authentication'
    }
    #swagger.parameters['refreshToken'] = {
      in: 'header',
      required: false,
      type: 'string',
      description: 'Refresh token for authentication'
    }
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/GetAllAffiliateLinksResponse' }
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

AffiliateLinkRoutes.get(
  "/paginated",
  GetPaginatedAffiliateLinksController
  /*
    #swagger.tags = ['Affiliate - Links']
    #swagger.description = "Fetch a paginated list of affiliate links (requires authentication)"
    
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

    #swagger.parameters['affiliateProgramId'] = {
      in: 'query',
      required: false,
      type: 'integer',
      description: "Optional filter to return affiliate links associated with a specific affiliate program ID.",
      example: 5
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
      schema: { $ref: '#/definitions/GetPaginatedAffiliateLinksResponse' }
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

AffiliateLinkRoutes.get(
  "/:id",
  GetAffiliateLinkByIdController
  /*
    #swagger.tags = ['Affiliate - Links']
    #swagger.description = "Get an affiliate link by ID (requires authentication and validates ID)"
    #swagger.parameters['accessToken'] = {
      in: 'header',
      required: false,
      type: 'string',
      description: 'Access token for authentication'
    }
    #swagger.parameters['refreshToken'] = {
      in: 'header',
      required: false,
      type: 'string',
      description: 'Refresh token for authentication'
    }
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/GetAffiliateLinkByIdResponse' }
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

AffiliateLinkRoutes.put(
  "/:id",
  UpdateAffiliateLinkController
  /*
    #swagger.tags = ['Affiliate - Links']
    #swagger.description = "Update an affiliate link by ID (requires authentication and validates ID)"
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      description: "Payload for updating an existing affiliate link. This should include the link details that need to be updated.",
      schema: { $ref: '#/definitions/UpdateAffiliateLinkPayload' }
    }
    #swagger.parameters['accessToken'] = {
      in: 'header',
      required: false,
      type: 'string',
      description: 'Access token for authentication'
    }
    #swagger.parameters['refreshToken'] = {
      in: 'header',
      required: false,
      type: 'string',
      description: 'Refresh token for authentication'
    }
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/UpdateAffiliateLinkResponse' }
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

AffiliateLinkRoutes.delete(
  "/:id",
  DeleteAffiliateLinkController
  /*
    #swagger.tags = ['Affiliate - Links']
    #swagger.description = "Delete an affiliate link by ID (requires authentication and validates ID)"
    #swagger.parameters['accessToken'] = {
      in: 'header',
      required: false,
      type: 'string',
      description: 'Access token for authentication'
    }
    #swagger.parameters['refreshToken'] = {
      in: 'header',
      required: false,
      type: 'string',
      description: 'Refresh token for authentication'
    }
    #swagger.responses[204] = {
      description: "No Content",
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

export default AffiliateLinkRoutes;
