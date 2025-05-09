import express, { Router, Request, Response } from "express";
import controller from "../controllers/options.controller";
import { verifyUser } from "../middlewares/auth";
import { verifyStaff, tradeStaff } from "../middlewares/staff";

const routes: Router = express.Router();

routes.get("/tickers", verifyStaff, tradeStaff, async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = 'List or filter tickers'
        #swagger.responses[200] = { schema : { $ref : '#/definitions/ListTickersResponse' } }
    */
  return await controller.getTickers(req, res);
});

routes.use(verifyUser);
routes.get('/ticker/:ticker', async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.responses[200] = { schema : { $ref : '#/definitions/GetTickerResponse' } }
    */
  return await controller.getTicker(req, res);
})

routes.post(
  "/pin-ticker",
  async (req: any, res: Response): Promise<Response> => {
    /* 
      #swagger.description = 'Pin a Ticker'
      #swagger.parameters['body'] = { in: 'body', schema: { $ref : "#/definitions/PinTickerPayload" } }
    */
    return await controller.pinTicker(req, res);
  }
);
routes.get(
  "/pinned-tickers",
  async (req: any, res: Response): Promise<Response> => {
    /* #swagger.description = 'List Pinned Tickers'
       #swagger.responses[200] = { schema : { $ref : '#/definitions/ListPinnedTickersResponse' } }
    */
    return await controller.listPinnedTickers(req, res);
  }
);

routes.delete('/pin-ticker/:id', async (req: any, res: Response): Promise<Response> => {
  return await controller.deletePinned(req, res);
})

export default routes;
