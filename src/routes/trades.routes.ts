import express, { Router, Request, Response } from "express";
import controller from "../controllers/trades.controller";
import { verifyUser } from "../middlewares/auth";

const routes: Router = express.Router();

routes.use(verifyUser);
routes.get("/", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = 'Filter Trade History'
        #swagger.parameters["q"] = { in : 'query', type : 'string' }
        #swagger.parameters["symbol"] = { in : 'query', type : 'string' }
        #swagger.parameters["page"] = { in : 'query', type : 'number' }
        #swagger.parameters["size"] = { in : 'query', type : 'number' }
        #swagger.parameters["period"] = { in : 'query', type : 'number' }
        #swagger.parameters["pending"] = { in : 'query', type : 'boolean' }
        #swagger.parameters["order"] = { in : 'query', type : 'string', description : "asc or desc" }
        #swagger.responses[200] = { schema : { $ref : '#/definitions/TradeHistoryResponse' } }
    */
  return await controller.history(req, res);
});

routes.get('/leaders', async (req : any, res : Response) : Promise<Response> =>{
  /*
        #swagger.description = 'Get Leaders Board'
        #swagger.responses[200] = { schema : { $ref : '#/definitions/GetLeadersResponse' } }
    */
  return await controller.leadersBoard(req, res);
})

routes.get("/:id", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = 'Filter Trade History'
        #swagger.responses[200] = { schema : { $ref : '#/definitions/TradeResponse' } }
    */
  return await controller.getHistory(req, res);
});


export default routes;
