import { Router, Request, Response } from "express";
import controller from "../../controllers/staff/auth.controller";
import { adminOnly, verifyStaff } from "../../middlewares/staff";

const routes: Router = Router();

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
  "/password/otp",
  async (req: any, res: Response): Promise<Response> => {
    /*
        #swagger.description = "Start password change process"
        #swagger.parameters['body'] = { in: 'body', schema: { $ref : '#/definitions/ResetPasswordOtpPayload' } }
    */
    return await controller.passwordOtp(req, res);
  }
);
routes.post(
  "/password/otp/verify",
  async (req: any, res: Response): Promise<Response> => {
    /*
        #swagger.description = "Verify password reset otp"
        #swagger.parameters['body'] = { in: 'body', schema: { $ref : '#/definitions/ResetPasswordVerifyPayload' } }
        #swagger.responses[200] = {schema: { $ref: '#/definitions/ResetPasswordVerifyResponse' }} 
    */
    return await controller.passwordOtpVerify(req, res);
  }
);
routes.post("/password", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = "Reset Password"
        #swagger.parameters['body'] = { in: 'body', schema: { $ref : '#/definitions/ResetPasswordPayload' } }
        #swagger.responses[200] = {schema: { $ref: '#/definitions/RequestSuccessful' }} 
    */
  return await controller.passwordReset(req, res);
});

routes.use(verifyStaff);

routes.get("/", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = "List staffs"
        #swagger.responses[200] = {schema: { $ref: '#/definitions/ListStaffsResponse' }} 
        #swagger.parameters["q"] = { in : 'query', type : 'string' }
        #swagger.parameters["page"] = { in : 'query', type : 'number' }
        #swagger.parameters["size"] = { in : 'query', type : 'number' }
        #swagger.parameters["order"] = { in : 'query', type : 'string', description : "asc or desc" }
        #swagger.parameters["user"] = { in : 'query', type : 'boolean' }
        #swagger.parameters["affiliate"] = { in : 'query', type : 'boolean' }
        #swagger.parameters["trade"] = { in : 'query', type : 'boolean' }
        #swagger.parameters["promotional"] = { in : 'query', type : 'boolean' }
        #swagger.parameters["is_admin"] = { in : 'query', type : 'boolean' }
    */
  return await controller.listStaffs(req, res);
});

routes.get(
  "/:id/activity",
  async (req: any, res: Response): Promise<Response> => {
    /*
        #swagger.description = "List staff activity"
        #swagger.responses[200] = {schema: { $ref: '#/definitions/ListStaffActivitiesResponse' }} 
        #swagger.parameters["q"] = { in : 'query', type : 'string' }
        #swagger.parameters["page"] = { in : 'query', type : 'number' }
        #swagger.parameters["size"] = { in : 'query', type : 'number' }
        #swagger.parameters["order"] = { in : 'query', type : 'string', description : "asc or desc" }
    */
    return await controller.staffActivities(req, res);
  }
);

routes.get("/dashboard", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = "Get Basic Staff Dashboard Stats"
        #swagger.responses[200] = {schema: { $ref: '#/definitions/StaffAuthDashboardResponse' }} 
    */
  return await controller.dashboard(req, res);
});

routes.get("/:id", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = "Get Staff By Id"
        #swagger.responses[200] = {schema: { $ref: '#/definitions/GetStaffResponse' }} 
    */
  return await controller.getStaff(req, res);
});

routes.put("/password", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = "Change Password"
        #swagger.parameters['body'] = { in: 'body', schema: { $ref : '#/definitions/ChangePasswordPayload' } }
        #swagger.responses[200] = {schema: { $ref: '#/definitions/RequestSuccessful' }} 
    */
  return await controller.changePasswordReset(req, res);
});

routes.put("/", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = "Update Info"
        #swagger.parameters['body'] = { in: 'body', schema: { $ref : '#/definitions/UpdateStaffPayload' } }
        #swagger.responses[200] = {schema: { $ref: '#/definitions/GetStaffResponse' }} 
    */
  return await controller.updateStaff(req, res);
});

routes.use(adminOnly);
routes.post("/", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = "Create Staff"
        #swagger.responses[200] = {schema: { $ref: '#/definitions/RequestSuccessful' }} 
        #swagger.parameters['body'] = { in: 'body', schema: { $ref : '#/definitions/CreateStaffPayload' } }
    */
  return await controller.createStaff(req, res);
});
routes.put("/:id", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = "Update staff permission"
    */
  return await controller.editStaffPermission(req, res);
});
routes.put(
  "/:id/role/toggle",
  async (req: any, res: Response): Promise<Response> => {
    return await controller.toggleRole(req, res);
  }
);
routes.put(
  "/:id/status/toggle",
  async (req: any, res: Response): Promise<Response> => {
    return await controller.toggleStatus(req, res);
  }
);

export default routes;
