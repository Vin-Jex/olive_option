import { Router, Request, Response } from "express";
import controller from "../../controllers/staff/setting.controller";
import { verifyStaff, adminOnly } from "../../middlewares/staff";

const routes: Router = Router();

routes.get("/", async (req: any, res: Response): Promise<Response> => {
    /*
        #swagger.description = "Get Global Settings"
         #swagger.responses[200] = { schema : { $ref : '#/definitions/GlobalSettingsResponse' } }
    */
    return await controller.getSettings(req, res);
});

routes.get("/comission", async (req : any, res : Response) : Promise<Response> =>{
    /*
        #swagger.description = "List comission"  
        #swagger.parameters["q"] = { in : 'query', type : 'string' }
        #swagger.parameters["page"] = { in : 'query', type : 'number' }
        #swagger.parameters["size"] = { in : 'query', type : 'number' }
        #swagger.parameters["order"] = { in : 'query', type : 'string', description : "asc or desc" }
        #swagger.responses[200] = {schema: { $ref: '#/definitions/ListComissionsResponse' }} 
    */
    return await controller.listComissions(req, res);
});

routes.use(verifyStaff);
routes.use(adminOnly);


routes.put("/", async (req: any, res: Response): Promise<Response> => {
    /*
        #swagger.description = "Create or Update Global Settings"
        #swagger.responses[200] = { schema : { $ref : '#/definitions/GlobalSettingsResponse' } }
        #swagger.parameters['body'] = { in: 'body', schema: { $ref : '#/definitions/CreateSettingsPayload' } }
    */
    return await controller.createUpdateSetting(req, res);
});


routes.post("/ip", async (req: any, res: Response): Promise<Response> => {
    /*
        #swagger.description = "Block Ip"
        #swagger.parameters['body'] = { in: 'body', schema: { $ref : '#/definitions/BlockIpPayload' } }
    */
    return await controller.blockIp(req, res);
});
routes.delete("/ip/:id", async (req: any, res: Response): Promise<Response> => {
    return await controller.unblockIp(req, res);
});
routes.get("/ip", async (req: any, res: Response): Promise<Response> => {
    /*
        #swagger.description = "List blocked ips"
        #swagger.responses[200] = { in: 'body', schema: { $ref : '#/definitions/ListBlockedIps' } }
        #swagger.parameters["q"] = { in : 'query', type : 'string' }
        #swagger.parameters["page"] = { in : 'query', type : 'number' }
        #swagger.parameters["size"] = { in : 'query', type : 'number' }
        #swagger.parameters["order"] = { in : 'query', type : 'string', description : "asc or desc" }
    */
    return await controller.listBlockedIps(req, res);
});


routes.post("/profit", async (req : any, res : Response) : Promise<Response> =>{
    /*
        #swagger.description = "Create profit outcome"
        #swagger.parameters['body'] = { in: 'body', schema: { $ref : '#/definitions/CreateProfitOutcomePayload' } }
        #swagger.responses[200] = { schema : { $ref : '#/definitions/CreateProfitOutcomeResponse' } }
    */
    return await controller.createCustomProfitOutcome(req, res);
});
routes.put("/profit/:id", async (req : any, res : Response) : Promise<Response> =>{
    /*
        #swagger.description = "Edit profit outcome"
        #swagger.parameters['body'] = { in: 'body', schema: { $ref : '#/definitions/CreateProfitOutcomePayload' } }
        #swagger.responses[200] = { schema : { $ref : '#/definitions/CreateProfitOutcomeResponse' } }
    */
    return await controller.editCustomProfitOutcome(req, res);
});
routes.delete("/profit/:id", async (req : any, res : Response) : Promise<Response> =>{
    return await controller.deleteCustomProfitOutcome(req, res);
});
routes.get("/profit", async (req : any, res : Response) : Promise<Response> =>{
    /*
        #swagger.description = "List custom profit outcomes"  
        #swagger.parameters["q"] = { in : 'query', type : 'string' }
        #swagger.parameters["page"] = { in : 'query', type : 'number' }
        #swagger.parameters["size"] = { in : 'query', type : 'number' }
        #swagger.parameters["order"] = { in : 'query', type : 'string', description : "asc or desc" }
        #swagger.responses[200] = {schema: { $ref: '#/definitions/ListCustomProfitOutcomeResponse' }} 
    */
    return await controller.listCustomProfitOutcomes(req, res);
});


routes.post("/comission", async (req : any, res : Response) : Promise<Response> =>{
    /*
        #swagger.description = "Create comission exception"
        #swagger.parameters['body'] = { in: 'body', schema: { $ref : '#/definitions/CreateComissionPayload' } }
        #swagger.responses[200] = { schema : { $ref : '#/definitions/GetComissionResponse' } }
    */
    return await controller.createComission(req, res);
});
routes.put("/comission/:id", async (req : any, res : Response) : Promise<Response> =>{
    /*
        #swagger.description = "Edit comission exception"
        #swagger.parameters['body'] = { in: 'body', schema: { $ref : '#/definitions/CreateComissionPayload' } }
        #swagger.responses[200] = { schema : { $ref : '#/definitions/GetComissionResponse' } }
    */
    return await controller.editComission(req, res);
});
routes.delete("/comission/:id", async (req : any, res : Response) : Promise<Response> =>{
    return await controller.deleteComission(req, res);
});


export default routes;
