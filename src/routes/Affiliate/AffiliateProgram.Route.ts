import { Router } from "express";
import {
  createAffiliateProgram,
  updateAffiliateProgram,
  deleteAffiliateProgram,
  getAffiliateProgramById,
  getAllAffiliatePrograms,
  validateAffiliateProgram,
} from "../../controllers/Affiliate/AffiliateProgram.Controller";
import { authMiddleware } from "../../middlewares/Affiliate/Affiliate.Middleware";

const AffiliateProgramRoutes = Router();

// authMiddleware for all routes
AffiliateProgramRoutes.use(authMiddleware);

AffiliateProgramRoutes.post(
  "/",
  createAffiliateProgram
  /*
  #swagger.tags = ['Affiliate - Program Types']
  #swagger.description = "Create a new Affiliate program (requires authentication)"
  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    description: "Payload for creating a new Affiliate program, including the program name.",
    schema: { $ref: '#/definitions/CreateAffiliateProgramTypePayload', description: "The name of the Affiliate program" }
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
    schema: { $ref: '#/definitions/CreateAffiliateProgramTypeResponse' }
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

AffiliateProgramRoutes.put(
  "/:id",
  updateAffiliateProgram
  /*
    #swagger.tags = ['Affiliate - Program Types']
    #swagger.description = "Update an Affiliate program by ID (requires authentication)"
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      description: "Payload for updating the Affiliate program, including the updated name.",
      schema: { $ref: '#/definitions/CreateAffiliateProgramTypePayload', description: "The updated name of the Affiliate program" }
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
      schema: { $ref: '#/definitions/UpdateAffiliateProgramTypeResponse' }
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

AffiliateProgramRoutes.delete(
  "/:id",
  deleteAffiliateProgram
  /*
    #swagger.tags = ['Affiliate - Program Types']
    #swagger.description = "Delete an Affiliate program by ID (requires authentication)"
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

AffiliateProgramRoutes.get(
  "/:id",
  getAffiliateProgramById
  /*
    #swagger.tags = ['Affiliate - Program Types']
    #swagger.description = "Get an Affiliate program by ID (requires authentication)"
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
      schema: { $ref: '#/definitions/GetAffiliateProgramTypeByIdResponse' }
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

AffiliateProgramRoutes.get(
  "/",
  getAllAffiliatePrograms
  /*
    #swagger.tags = ['Affiliate - Program Types']
    #swagger.description = "Get all Affiliate programs (requires authentication)"
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
      schema: { $ref: '#/definitions/GetAllAffiliateProgramTypesResponse' }
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

AffiliateProgramRoutes.post(
  "/validate",
  validateAffiliateProgram
  /*
    #swagger.tags = ['Affiliate - Program Types']
    #swagger.description = "Validate an Affiliate program by name (requires authentication)"
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      description: "Payload for validating the Affiliate program, including the program name.",
      schema: { 
        type: "object",
        properties: {
          name: { type: "string", description: "The name of the Affiliate program to validate" }
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
      schema: { $ref: '#/definitions/ValidateAffiliateProgramTypeResponse' },
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

export default AffiliateProgramRoutes;
