import express, { Router, Request, Response } from "express";
import controller from "../controllers/wallet.controller";
import { verifyUser, allowOnlyDemoMode, allowOnlyLiveMode, nowPayWebhook, allowUserOrAffiliate } from "../middlewares/auth";

const routes: Router = express.Router();

routes.post('/nowpay/payment/callback', nowPayWebhook, async (req : Request, res : Response) : Promise<Response> =>{ 
  /* 
    #swagger.ignore = true
  */
  return await controller.nowpayPaymentCallback(req, res); 
});

routes.post(
  "/reset-wallet",
  verifyUser,
  allowOnlyDemoMode,
  async (req: any, res: Response): Promise<Response> => {
    /*
        #swagger.description = 'Endpoint to reset wallet'
        #swagger.responses[200] = { schema : { $ref : '#/definitions/GetWalletResponse' } }
    */
    return await controller.resetWallet(req, res);
  }
);

routes.use(allowUserOrAffiliate);
routes.get("/", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = 'Endpoint to get wallet'
        #swagger.responses[200] = { schema : { $ref : '#/definitions/GetWalletResponse' } }
    */
  return await controller.getWallet(req, res);
});


routes.get(
  "/transactions",
  async (req: any, res: Response): Promise<Response> => {
    /*
        #swagger.description = 'List transactions endpoint.'
        #swagger.parameters['query'] = { in : 'query', schema : { $ref : '#/definitions/ListTransactionsPayload' } }
        #swagger.responses[200] = { schema : { $ref : '#/definitions/ListTransactionsResponse' } }
    */
    return await controller.transactions(req, res);
  }
);

routes.get(
  "/get-transaction/:id",
  async (req: any, res: Response): Promise<Response> => {
    /*
        #swagger.description = 'Get transaction'
        #swagger.parameters['id'] = { in : 'path', type : 'number', required : true }
        #swagger.responses[200] = { schema : { $ref : '#/definitions/GetTransactionResponse' } }
    */
    return await controller.getTransaction(req, res);
  }
);

routes.post('/init-fund-wallet', allowOnlyLiveMode, async (req : any, res : Response) : Promise<Response> =>{ 
  /* 
        #swagger.description = 'Init fund wallet'
        #swagger.parameters['body'] = { in: 'body', schema: { $ref : '#/definitions/InitFundWalletPayload' } }
        #swagger.responses[200] = { schema : { $ref : '#/definitions/InitFundWalletResponse' } }
  */
  return await controller.initFundWallet(req, res); 
});
routes.post('/init-payout', allowOnlyLiveMode, async (req : any, res : Response) : Promise<Response> =>{ 
  
  /* 
        #swagger.description = 'Init payout'
        #swagger.parameters['body'] = { in: 'body', schema: { $ref : '#/definitions/InitPayoutPayload' } }
        #swagger.responses[200] = { schema : { $ref : '#/definitions/InitPayoutResponse' } }
  */
 return await controller.initPayout(req, res); 
});

export default routes;
