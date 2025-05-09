import express, { Router, Request, Response } from "express";
import controller from "../controllers/alert.controller";
import { verifyUser } from "../middlewares/auth";

const routes: Router = express.Router();

routes.use(verifyUser);
routes.post('/', async (req : any, res : Response) : Promise<Response> =>{ 
    /*
        #swagger.responses[200] = {schema: { $ref: '#/definitions/GetAlertResponse' }} 
        #swagger.parameters['body'] = { in: 'body', schema: { $ref : '#/definitions/CreateAlertPayload' } }
    */
    return await controller.createAlert(req, res); 
})
routes.put('/:id', async (req : any, res : Response) : Promise<Response> =>{ 
    /*
        #swagger.responses[200] = {schema: { $ref: '#/definitions/GetAlertResponse' }} 
        #swagger.parameters['body'] = { in: 'body', schema: { $ref : '#/definitions/CreateAlertPayload' } }
    */
    return await controller.editAlert(req, res); 
})
routes.delete('/:id', async (req : any, res : Response) : Promise<Response> =>{ return await controller.deleteAlert(req, res); })
routes.get('/', async (req : any, res : Response) : Promise<Response> =>{ 
    /*
        #swagger.responses[200] = {schema: { $ref: '#/definitions/ListAlertsResponse' }} 
        #swagger.parameters["q"] = { in : 'query', type : 'string' }
        #swagger.parameters["page"] = { in : 'query', type : 'number' }
        #swagger.parameters["size"] = { in : 'query', type : 'number' }
        #swagger.parameters["order"] = { in : 'query', type : 'string', description : "asc or desc" }
    */
    return await controller.listAlerts(req, res); 
});
routes.get('/:id', async (req : any, res : Response) : Promise<Response> =>{ 
    /*
        #swagger.responses[200] = {schema: { $ref: '#/definitions/GetAlertResponse' }} 
    */
    return await controller.getAlert(req, res); 
})

export default routes;
