import { Router, Request, Response } from "express";
import controller from "../../controllers/staff/trade.controller";
import { verifyStaff, tradeStaff } from "../../middlewares/staff";

const routes: Router = Router();

routes.get('/pair', async (req : any, res : Response) : Promise<Response> =>{ 
  /*
      #swagger.responses[200] = {schema: { $ref: '#/definitions/ListTradePairsResponse' }} 
      #swagger.parameters["q"] = { in : 'query', type : 'string' }
      #swagger.parameters["page"] = { in : 'query', type : 'number' }
      #swagger.parameters["size"] = { in : 'query', type : 'number' }
      #swagger.parameters["order"] = { in : 'query', type : 'string', description : "asc or desc" }
  */
  return await controller.listPairs(req, res); })
routes.get('/pair/:id', async (req : any, res : Response) : Promise<Response> =>{ 
  /*
      #swagger.responses[200] = {schema: { $ref: '#/definitions/GetTradePairResponse' }} 
  */
  return await controller.getPair(req, res); 
})

routes.use(verifyStaff);
routes.use(tradeStaff);

routes.post('/pair', async (req : any, res : Response) : Promise<Response> =>{ 
  /*
      #swagger.responses[200] = {schema: { $ref: '#/definitions/GetTradePairResponse' }} 
       #swagger.parameters['body'] = { in: 'body', schema: { $ref : '#/definitions/CreateTradePairPayload' } }
  */
  return await controller.createPair(req, res);
})
routes.put('/pair/:id', async (req : any, res : Response) : Promise<Response> =>{ 
  /*
      #swagger.responses[200] = {schema: { $ref: '#/definitions/GetTradePairResponse' }} 
       #swagger.parameters['body'] = { in: 'body', schema: { $ref : '#/definitions/CreateTradePairPayload' } }
  */
  return await controller.editPair(req, res);
})
routes.delete('/pair/:id', async (req : any, res : Response) : Promise<Response> =>{ return await controller.deletePair(req, res); })

routes.get("/:id/user", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = "List user trade history"
        #swagger.responses[200] = {schema: { $ref: '#/definitions/UserTradeHistoryResponse' }} 
        #swagger.parameters["q"] = { in : 'query', type : 'string' }
        #swagger.parameters["page"] = { in : 'query', type : 'number' }
        #swagger.parameters["size"] = { in : 'query', type : 'number' }
        #swagger.parameters["order"] = { in : 'query', type : 'string', description : "asc or desc" }
    */
  return await controller.tradeHistory(req, res);
});

routes.get("/", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = "List trade history"
        #swagger.responses[200] = {schema: { $ref: '#/definitions/UserTradeHistoryResponse' }} 
        #swagger.parameters["q"] = { in : 'query', type : 'string' }
        #swagger.parameters["page"] = { in : 'query', type : 'number' }
        #swagger.parameters["size"] = { in : 'query', type : 'number' }
        #swagger.parameters["order"] = { in : 'query', type : 'string', description : "asc or desc" }
    */
  return await controller.allHistory(req, res);
});

routes.get("/:id", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = "Get trade"
        #swagger.responses[200] = {schema: { $ref: '#/definitions/StaffGetTradeResponse' }}
    */
  return await controller.getTrade(req, res);
});

export default routes;
