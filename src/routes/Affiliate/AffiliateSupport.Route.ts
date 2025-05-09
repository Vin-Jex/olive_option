import { Router } from "express";
import { SubmitSupportMessageController } from "../../controllers/Affiliate/AffiliateSupport.Controller";
import { authMiddleware } from "../../middlewares/Affiliate/Affiliate.Middleware";

const SupportRouter = Router();

// authMiddleware for all routes
SupportRouter.use(authMiddleware);

/**
 * Route to submit a support message.
 */
SupportRouter.post(
  "/support",
  SubmitSupportMessageController
  /*
    #swagger.tags = ['Affiliate - Support']
    #swagger.description = "Submit a support message."
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      description: "Payload for creating sending a support request.",
      schema: { 
        $ref: '#/definitions/SupportMessageRequest' 
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
      description: "Support message received successfully.",
      schema: { $ref: '#/definitions/SupportMessageResponse' }
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

export default SupportRouter;
