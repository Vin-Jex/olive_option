import { Router } from "express";
import {
  createAffiliate,
  deleteAffiliate,
  getAffiliateById,
  getPaginatedAffiliates,
  updateAffiliate,
} from "../../controllers/Affiliate/Affiliate.Controller";
import { authMiddleware } from "../../middlewares/Affiliate/Affiliate.Middleware";
import { validateAffiliateId } from "../../middlewares/ValidateAffiliateId.Middleware";

const affiliateRoutes = Router();

// Use authMiddleware for all routes to protect them (It also checks for if the user is an administrator)
affiliateRoutes.use(authMiddleware);

affiliateRoutes.post(
  "/",
  createAffiliate
  /*
  #swagger.tags = ['Affiliate']
  #swagger.description = "Create a new affiliate (requires authentication)"
  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    schema: { $ref: '#/definitions/CreateAffiliatePayload' }
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
    schema: { $ref: '#/definitions/CreateAffiliateResponse' }
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

affiliateRoutes.get(
  "/:id",
  validateAffiliateId,
  getAffiliateById
  /*
    #swagger.tags = ['Affiliate']
    #swagger.description = "Get an affiliate by ID (requires authentication and validates ID)"
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
      schema: { $ref: '#/definitions/GetAffiliateByIdResponse' }
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

affiliateRoutes.get(
  "/",
  getPaginatedAffiliates
  /*
    #swagger.tags = ['Affiliate']
    #swagger.description = "Get a paginated list of affiliates (requires authentication)"
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
      schema: { $ref: '#/definitions/GetPaginatedAffiliatesResponse' }
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

affiliateRoutes.put(
  "/:id",
  validateAffiliateId,
  updateAffiliate
  /*
    #swagger.tags = ['Affiliate']
    #swagger.description = "Update an affiliate by ID (requires authentication and validates ID)"
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/UpdateAffiliatePayload' }
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
      schema: { $ref: '#/definitions/UpdateAffiliateResponse' }
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

affiliateRoutes.delete(
  "/:id",
  validateAffiliateId,
  deleteAffiliate
  /*
    #swagger.tags = ['Affiliate']
    #swagger.description = "Delete an affiliate by ID (requires authentication and validates ID)"
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
      schema: { $ref: '#/definitions/DeleteAffiliateResponse' }
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

export default affiliateRoutes;
