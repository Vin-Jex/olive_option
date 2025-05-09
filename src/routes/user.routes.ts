import express, { Router, Request, Response } from "express";
import controller from "../controllers/user.controller";
import { verifyUser } from "../middlewares/auth";
import { otp_types } from "../utils/consts";
import { profilePicUpload } from "../middlewares/multer";

const routes: Router = express.Router();

routes.post("/", async (req: Request, res: Response): Promise<Response> => {
  /*
        #swagger.description = 'Signup endpoint'
        #swagger.parameters['body'] = { in: 'body', schema: { $ref : '#/definitions/UserSignupOrLoginPayload' } }
    */
  return await controller.signup(req, res);
});
routes.post(
  "/login",
  async (req: Request, res: Response): Promise<Response> => {
    /*
        #swagger.parameters['body'] = { in: 'body', schema: { $ref : '#/definitions/UserSignupOrLoginPayload' } }
        #swagger.responses[200] = { schema : { $ref : '#/definitions/UserLoginResponse' } }
    */
    return await controller.login(req, res);
  }
);
routes.post(
  "/password/reset/otp",
  async (req: Request, res: Response): Promise<Response> => {
    /*
        #swagger.tags = ['Password Reset', 'User']
        #swagger.parameters['body'] = { in: 'body', schema: { $ref : '#/definitions/ResetPasswordOtpPayload' } }
    */
    return await controller.resetOtp(req, res);
  }
);
routes.post(
  "/password/reset/verify",
  async (req: Request, res: Response): Promise<Response> => {
    /*
        #swagger.tags = ['Password Reset', 'User']
        #swagger.parameters['body'] = { in: 'body', schema: { $ref : '#/definitions/ResetPasswordVerifyPayload' } }
        #swagger.responses[200] = { schema : { $ref : '#/definitions/ResetPasswordVerifyResponse' } }
    */
    return await controller.resetVerify(req, res);
  }
);
routes.put(
  "/password/reset",
  async (req: Request, res: Response): Promise<Response> => {
    /*
        #swagger.tags = ['Password Reset', 'User']
        #swagger.parameters['body'] = { in: 'body', schema: { $ref : '#/definitions/ResetPasswordPayload' } }
    */
    return await controller.resetPassword(req, res);
  }
);

routes.use(verifyUser);
routes.post(
  "/email/otp",
  async (req: any, res: Response): Promise<Response> => {
    // #swagger.tags = ['Verify Email', 'User']
    return await controller.resetOtp(req, res, otp_types.verify_email);
  }
);
routes.post(
  "/email/verify",
  async (req: any, res: Response): Promise<Response> => {
    /*
        #swagger.tags = ['Verify Email', 'User']
        #swagger.parameters['body'] = { in: 'body', schema: { $ref : '#/definitions/EmailVerifyPayload' } }
    */
    return await controller.verifyOtp(req, res);
  }
);
routes.get("/me", async (req: any, res: Response): Promise<Response> => {
  // #swagger.responses[200] = { schema : { $ref : '#/definitions/MeResponse' } }
  return await controller.me(req, res);
});
routes.get("/refresh", async (req: any, res: Response): Promise<Response> => {
  // #swagger.responses[200] = { schema : { $ref : '#/definitions/UserLoginResponse' } }
  return await controller.refresh(req, res);
});
routes.put("/", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.parameters['body'] = { in : 'body', schema : { $ref : '#/definitions/UpdateUserPayload' } }
        #swagger.responses[200] = { schema : { $ref : '#/definitions/MeResponse' } }
    */
  return await controller.updateUserDetails(req, res);
});
routes.put("/settings", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.parameters['body'] = { in : 'body', schema : { $ref : '#/definitions/UpdateUserSettingsPayload' } }
        #swagger.responses[200] = { schema : { $ref : '#/definitions/MeResponse' } }
    */
  return await controller.updateUserSettings(req, res);
});
routes.put("/password", async (req: any, res: Response): Promise<Response> => {
  // #swagger.parameters['body'] = { in : 'body', schema : { $ref : '#/definitions/UpdatePasswordPayload' } }
  return await controller.changePassword(req, res);
});
routes.post(
  "/upload_pfp",
  profilePicUpload,
  async (req: any, res: Response): Promise<Response> => {
    /*
        #swagger.consumes = ['multipart/form-data']  
            #swagger.parameters['profile_pic'] = {
                in: 'formData',
                type: 'file',
                required: 'true'
        }
        #swagger.responses[200] = { schema : { $ref : '#/definitions/MeResponse' } }
    */
    return await controller.uploadProfilePic(req, res);
  }
);

routes.post(
  "/toggle-live",
  async (req: any, res: Response): Promise<Response> => {
    /*
        #swagger.description = 'Endpoint to toggle between live and demo mode.'
        #swagger.responses[200] = { schema : { $ref : '#/definitions/MeResponse' } }
    */
    return await controller.toggleLive(req, res);
  }
);

export default routes;
