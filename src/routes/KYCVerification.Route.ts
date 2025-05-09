import { Router } from "express";
import {
  submitKYCController,
  getUserKYCController,
  getAllKYCsController,
  verifyKYCController,
  rejectKYCController,
  deleteKYCController,
} from "../controllers/KYCVerification.Controller";
import { verifyUser } from "../middlewares/auth";

const KYCVerificationRouter = Router();

// authMiddleware for all routes to protect them
KYCVerificationRouter.use(verifyUser);

KYCVerificationRouter.post(
  "/submit",
  submitKYCController
  /*
    #swagger.tags = ['KYC - Verification']
    #swagger.description = "Submit KYC (requires authentication)"
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      description: "Payload for submitting KYC, including document type, and front & back file.",
      schema: { $ref: '#/definitions/SubmitKYC' }
    }
    #swagger.responses[201] = {
      description: "Created",
      schema: { $ref: '#/definitions/SubmitKYCResponse' }
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
  */
);

KYCVerificationRouter.get(
  "/user",
  getUserKYCController
  /*
    #swagger.tags = ['KYC - Verification']
    #swagger.description = "Get KYC information for the authenticated user"
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/GetUserKYCResponse' }
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
  */
);

KYCVerificationRouter.get(
  "/all",
  getAllKYCsController
  /*
    #swagger.tags = ['KYC - Verification']
    #swagger.description = "Get all KYCs (requires admin privileges)"
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/GetAllKYCsResponse' }
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
  */
);

KYCVerificationRouter.put(
  "/verify/:kycId",
  verifyKYCController
  /*
    #swagger.tags = ['KYC - Verification']
    #swagger.description = "Verify KYC by ID (requires admin privileges)"
    #swagger.parameters['kycId'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: "The KYC ID to verify"
    }
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/VerifyKYCResponse' }
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
  */
);

KYCVerificationRouter.put(
  "/reject/:kycId",
  rejectKYCController
  /*
    #swagger.tags = ['KYC - Verification']
    #swagger.description = "Reject KYC by ID (requires admin privileges)"
    #swagger.parameters['kycId'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: "The KYC ID to reject"
    }
    #swagger.parameters['reason'] = {
      in: 'query',
      required: true,
      type: 'string',
      description: "Reason for rejection"
    }
    #swagger.responses[200] = {
      description: "OK",
      schema: { $ref: '#/definitions/RejectKYCResponse' }
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
  */
);

KYCVerificationRouter.delete(
  "/delete/:kycId",
  deleteKYCController
  /*
    #swagger.tags = ['KYC - Verification']
    #swagger.description = "Delete KYC by ID (requires admin privileges)"
    #swagger.parameters['kycId'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: "The KYC ID to delete"
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
  */
);

export default KYCVerificationRouter;
