import { Router, Request, Response } from "express";
import controller from "../../controllers/staff/content.controller";
import { verifyStaff, promotionalStaff } from "../../middlewares/staff";
import { contentDocumentUpload } from "../../middlewares/multer";

const routes: Router = Router();

routes.get(
  "/:user_category/:category",
  async (req: any, res: Response): Promise<Response> => {
    /*
        #swagger.responses[200] = { schema : { $ref : '#/definitions/GetContentResponse' } }
    */
    return await controller.getContent(req, res);
  }
);

routes.use(verifyStaff);
routes.use(promotionalStaff);
routes.post(
  "/",
  contentDocumentUpload,
  async (req: any, res: Response): Promise<Response> => {
    /*
        #swagger.consumes = ['multipart/form-data']  
        #swagger.parameters['document'] = {
            in: 'formData',
            type: 'file',
            required: 'true'
        }
        #swagger.parameters['user_category'] = {
            in: 'formData',
            type: 'text',
            required: 'true'
        }
        #swagger.parameters['category'] = {
            in: 'formData',
            type: 'text',
            required: 'true'
        }
        #swagger.parameters['content'] = {
            in: 'formData',
            type: 'text',
            required: 'true'
        }
        #swagger.responses[200] = { schema : { $ref : '#/definitions/GetContentResponse' } }
    */
    return await controller.createContent(req, res);
  }
);
routes.delete("/:id", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = "Delete Content"
    */
  return await controller.deleteContent(req, res);
});

export default routes;
