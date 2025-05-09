import { Router, Request, Response } from "express";
import controller from "../../controllers/staff/faq.controller";
import { verifyStaff, promotionalStaff } from "../../middlewares/staff";

const routes: Router = Router();

routes.get("/", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = "Endpoint to list faqs(open for everyone)"  
        #swagger.parameters["q"] = { in : 'query', type : 'string' }
        #swagger.parameters["page"] = { in : 'query', type : 'number' }
        #swagger.parameters["size"] = { in : 'query', type : 'number' }
        #swagger.parameters["category"] = { in : 'query', type : 'number' }
        #swagger.parameters["order"] = { in : 'query', type : 'string', description : "asc or desc" }
        #swagger.responses[200] = {schema: { $ref: '#/definitions/ListFaqsResponse' }} 
    */
  return await controller.listFaqs(req, res);
});
routes.get("/:id/open", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = "Get Faq(open to everyone)"
        #swagger.responses[200] = {schema: { $ref: '#/definitions/GetFaqResponse' }} 
    */
  return await controller.getFaq(req, res);
});

routes.use(verifyStaff);
routes.use(promotionalStaff);

routes.post("/category", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = "Create Faq Category"
        #swagger.responses[200] = {schema: { $ref: '#/definitions/GetFaqCategoryResponse' }} 
        #swagger.parameters['body'] = { in: 'body', schema: { $ref : '#/definitions/CreateFaqCategoryPayload' } }
    */
  return await controller.createFaqCategory(req, res);
});
routes.delete(
  "/category/:id",
  async (req: any, res: Response): Promise<Response> => {
    /*
        #swagger.description = "Delete Faq Category"
    */
    return await controller.deleteFaqCategory(req, res);
  }
);
routes.put(
  "/category/:id",
  async (req: any, res: Response): Promise<Response> => {
    /*
        #swagger.description = "Edit Faq Catgory"
        #swagger.responses[200] = {schema: { $ref: '#/definitions/GetFaqCategoryResponse' }} 
        #swagger.parameters['body'] = { in: 'body', schema: { $ref : '#/definitions/CreateFaqCategoryPayload' } }
    */
    return await controller.editFaqCategory(req, res);
  }
);
routes.get("/category", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = "Endpoint to list faq categories"  
        #swagger.parameters["q"] = { in : 'query', type : 'string' }
        #swagger.parameters["page"] = { in : 'query', type : 'number' }
        #swagger.parameters["size"] = { in : 'query', type : 'number' }
        #swagger.parameters["order"] = { in : 'query', type : 'string', description : "asc or desc" }
        #swagger.responses[200] = {schema: { $ref: '#/definitions/ListFaqCategoriesResponse' }} 
    */
  return await controller.listFaqCategories(req, res);
});

routes.post("/", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = "Create Faq"
        #swagger.parameters['body'] = { in: 'body', schema: { $ref : '#/definitions/CreateFaqPayload' } }
        #swagger.responses[200] = {schema: { $ref: '#/definitions/GetFaqResponse' }} 
    */
  return await controller.createFaq(req, res);
});
routes.put("/:id", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = "Edit Faq"
        #swagger.parameters['body'] = { in: 'body', schema: { $ref : '#/definitions/CreateFaqPayload' } }
        #swagger.responses[200] = {schema: { $ref: '#/definitions/GetFaqResponse' }} 
    */
  return await controller.editFaq(req, res);
});
routes.delete("/:id", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = "Delete Faq"
    */
  return await controller.deleteFaq(req, res);
});

export default routes;
