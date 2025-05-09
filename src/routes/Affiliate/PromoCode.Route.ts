import { Router } from "express";
import {
  createPromoCode,
  deletePromoCode,
  getAllPromoCodes,
  getPromoCodeById,
  updatePromoCode,
  validatePromoCode,
} from "../../controllers/Affiliate/PromoCode.Controller";
import { authMiddleware } from "../../middlewares/Affiliate/Affiliate.Middleware";

const PromoCodeRoutes = Router();

// Use authMiddleware for all routes to protect them
PromoCodeRoutes.use(authMiddleware);

PromoCodeRoutes.post(
  "/",
  createPromoCode
  /*
  #swagger.tags = ['Affiliate - Promo Code']
  #swagger.description = "Create a new promo code (requires authentication)"
  #swagger.parameters['body'] = {
    in: 'body',
    required: true,
    description: "Payload for creating a new promo code. This should include the code, expiry date, usage limit, discount amount, and activation status. The promo code must be unique and 3 digits long because a unique 4-digit code will be attached to it, making its total length 7. The expiry date should be set in the future. The usage limit defines how many times the promo code can be used, while the discount amount specifies the monetary value of the discount to be applied.",
    schema: { $ref: '#/definitions/CreatePromoCodePayload' }
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
    schema: { $ref: '#/definitions/CreatePromoCodeResponse' }
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

PromoCodeRoutes.get(
  "/:id",
  getPromoCodeById
  /*
    #swagger.tags = ['Affiliate - Promo Code']
    #swagger.description = "Get a promo code by ID (requires authentication and validates ID)"
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
      schema: { $ref: '#/definitions/GetPromoCodeByIdResponse' }
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

PromoCodeRoutes.get(
  "/",
  getAllPromoCodes
  /*
    #swagger.tags = ['Affiliate - Promo Code']
    #swagger.description = "Get all promo codes (requires authentication)"
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
      schema: { $ref: '#/definitions/GetAllPromoCodesResponse' }
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

PromoCodeRoutes.put(
  "/:id",
  updatePromoCode
  /*
    #swagger.tags = ['Affiliate - Promo Code']
    #swagger.description = "Update a promo code by ID (requires authentication and validates ID)"
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      description: "Payload for updating an existing promo code. This should include the promo code details that need to be updated, such as the expiry date, usage limit, discount amount, and activation status. All fields are optional; however, at least one field must be provided to perform the update. The promo code itself remains unchanged unless specifically included in the payload.",
      schema: { $ref: '#/definitions/UpdatePromoCodePayload' }
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
      schema: { $ref: '#/definitions/UpdatePromoCodeResponse' }
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

PromoCodeRoutes.delete(
  "/:id",
  deletePromoCode
  /*
    #swagger.tags = ['Affiliate - Promo Code']
    #swagger.description = "Delete a promo code by ID (requires authentication and validates ID)"
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
      schema: { $ref: '#/definitions/DeletePromoCodeResponse' }
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

PromoCodeRoutes.post(
  "/validate",
  validatePromoCode
  /*
    #swagger.tags = ['Affiliate - Promo Code']
    #swagger.description = "Validate a promo code (requires authentication)"
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/ValidatePromoCodePayload' }
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
      description: "Valid",
      schema: { $ref: '#/definitions/ValidatePromoCodeResponse' }
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

export default PromoCodeRoutes;
