import { Router } from "express";
import {
  createLinkType,
  updateLinkType,
  deleteLinkType,
  getLinkTypeById,
  getAllLinkTypes,
  validateLinkType,
} from "../../controllers/Affiliate/LinkType.Controller";
import { authMiddleware } from "../../middlewares/Affiliate/Affiliate.Middleware";

const AffiliateLinkTypeRoutes = Router();

// authMiddleware for all routes to protect them
AffiliateLinkTypeRoutes.use(authMiddleware);

AffiliateLinkTypeRoutes.post(
  "/",
  createLinkType
  /*
  #swagger.tags = ['Affiliate - Link Types']
  #swagger.description = "Create a new link type (requires authentication)"
  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    description: "Payload for creating a new link type, including the name.",
    schema: { $ref: '#/definitions/CreateAffiliateLinkTypePayload', description: "The name of the link type" }
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
    schema: { $ref: '#/definitions/CreateAffiliateLinkTypeResponse' }
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

AffiliateLinkTypeRoutes.put(
  "/:id",
  updateLinkType
  /*
    #swagger.tags = ['Affiliate - Link Types']
    #swagger.description = "Update a link type by ID (requires authentication and validates ID)"
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      description: "Payload for updating an existing link type. This should include the updated name.",
      schema: { $ref: '#/definitions/CreateAffiliateLinkTypePayload', description: "The updated name of the link type" }
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
      schema: { $ref: '#/definitions/UpdateAffiliateLinkTypeResponse' }
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

AffiliateLinkTypeRoutes.delete(
  "/:id",
  deleteLinkType
  /*
    #swagger.tags = ['Affiliate - Link Types']
    #swagger.description = "Delete a link type by ID (requires authentication and validates ID)"
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

AffiliateLinkTypeRoutes.get(
  "/:id",
  getLinkTypeById
  /*
    #swagger.tags = ['Affiliate - Link Types']
    #swagger.description = "Get a link type by ID (requires authentication and validates ID)"
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
      schema: { $ref: '#/definitions/GetAffiliateLinkTypeByIdResponse' }
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

AffiliateLinkTypeRoutes.get(
  "/",
  getAllLinkTypes
  /*
    #swagger.tags = ['Affiliate - Link Types']
    #swagger.description = "Get all link types (requires authentication)"
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
      schema: { $ref: '#/definitions/GetAllAffiliateLinkTypesResponse' }
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

AffiliateLinkTypeRoutes.post(
  "/validate",
  validateLinkType
  /*
    #swagger.tags = ['Affiliate - Link Types']
    #swagger.description = "Validate a link type by name (requires authentication)"
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      description: "Payload for validating a link type, including the name.",
      schema: { 
        type: "object",
        properties: {
          name: { type: "string", description: "The name of the link type to validate" }
        },
        required: ["name"]
      }
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
      schema: { $ref: '#/definitions/ValidateAffiliateLinkTypeResponse' },
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

export default AffiliateLinkTypeRoutes;
