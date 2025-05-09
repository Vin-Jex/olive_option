import { Router, Request, Response } from "express";
import controller from "../../controllers/staff/user.controller";
import { verifyStaff, userStaff } from "../../middlewares/staff";

const routes: Router = Router();

routes.use(verifyStaff);
routes.use(userStaff);
routes.get("/", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = "List users"
        #swagger.responses[200] = {schema: { $ref: '#/definitions/ListUsersResponse' }} 
        #swagger.parameters["q"] = { in : 'query', type : 'string' }
        #swagger.parameters["page"] = { in : 'query', type : 'number' }
        #swagger.parameters["size"] = { in : 'query', type : 'number' }
        #swagger.parameters["order"] = { in : 'query', type : 'string', description : "asc or desc" }
    */
  return await controller.listUsers(req, res);
});
routes.get("/:id", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = "Get User by ID"
        #swagger.responses[200] = {schema: { $ref: '#/definitions/GetUserResponse' }} 
    */
  return await controller.getUser(req, res);
});
routes.post("/", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = "Create User"
        #swagger.parameters['body'] = { in: 'body', schema: { $ref : '#/definitions/CreateUserPayload' } }
    */
  return await controller.createUser(req, res);
});
routes.delete("/:id", async (req: any, res: Response): Promise<Response> => {
  return await controller.deleteUser(req, res);
});
routes.put(
  "/:id/status/toggle",
  async (req: any, res: Response): Promise<Response> => {
    return await controller.toggleStatus(req, res);
  }
);

export default routes;
