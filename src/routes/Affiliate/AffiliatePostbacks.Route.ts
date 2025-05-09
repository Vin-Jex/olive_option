import express from "express";
import {
  CreatePostbackController,
  DeletePostbackController,
  GetPostbackByIdController,
  GetPostbacksByUserIdController,
  UpdatePostbackController,
} from "../../controllers/Affiliate/AffiliatePostbacks.Controller";
import { authMiddleware } from "../../middlewares/Affiliate/Affiliate.Middleware";

const PostbackRouter = express.Router();

PostbackRouter.use(authMiddleware);
// Route to create a new postback
PostbackRouter.post(
  "/",
  CreatePostbackController
  /*
    #swagger.tags = ['Affiliate Postbacks']
    #swagger.description = "Creates a new postback record."
    #swagger.parameters['body'] = { 
      in: 'body', 
      required: true, 
      schema: { $ref: '#/definitions/CreatePostbackPayload' } 
    }
    #swagger.responses[201] = {
      description: "Created",
      schema: { $ref: '#/definitions/CreatePostbackResponse' }
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

// Route to get all postbacks created by an affiliate IDCrea
PostbackRouter.get(
  "/me/",
  GetPostbacksByUserIdController
  /*
    #swagger.tags = ['Affiliate Postbacks']
    #swagger.description = "Fetches all postbacks for a specific user."
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/GetPostbacksByUserIdResponse' }
    }
    #swagger.responses[404] = {
      description: "User not found",
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

// Route to get a postback by ID
PostbackRouter.get(
  "/:id",
  GetPostbackByIdController
  /*
    #swagger.tags = ['Affiliate Postbacks']
    #swagger.description = "Fetches a postback by its ID."
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: "The unique identifier of the postback record.",
      example: 1
    }
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/GetPostbackByIdResponse' }
    }
    #swagger.responses[404] = {
      description: "Postback not found",
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

// Route to update a postback by ID
PostbackRouter.put(
  "/:id",
  UpdatePostbackController
  /*
    #swagger.tags = ['Affiliate Postbacks']
    #swagger.description = "Updates a postback record by its ID."
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: "The unique identifier of the postback record.",
      example: 1
    }
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/UpdatePostbackPayload' }
    }
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/UpdatePostbackResponse' }
    }
    #swagger.responses[404] = {
      description: "Postback not found",
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

// Route to delete a postback by ID
PostbackRouter.delete(
  "/:id",
  DeletePostbackController
  /*
    #swagger.tags = ['Affiliate Postbacks']
    #swagger.description = "Deletes a postback record by its ID."
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'integer',
      description: "The unique identifier of the postback record.",
      example: 1
    }
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/DeletePostbackResponse' }
    }
    #swagger.responses[404] = {
      description: "Postback not found",
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



export default PostbackRouter;
