import { Router, Request, Response } from "express";
import controller from "../../controllers/staff/finance.controller";
import { verifyStaff, financeStaff } from "../../middlewares/staff";

const routes: Router = Router();

routes.use(verifyStaff);
routes.use(financeStaff);
routes.get("/:id/user", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = "List user transaction history"
        #swagger.responses[200] = {schema: { $ref: '#/definitions/UserTradeHistoryResponse' }} 
        #swagger.parameters["q"] = { in : 'query', type : 'string' }
        #swagger.parameters["page"] = { in : 'query', type : 'number' }
        #swagger.parameters["size"] = { in : 'query', type : 'number' }
        #swagger.parameters["order"] = { in : 'query', type : 'string', description : "asc or desc" }
    */
  return await controller.transactionHistory(req, res);
});
routes.get("/wallets", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = "List wallets"
        #swagger.responses[200] = {schema: { $ref: '#/definitions/ListWalletsResponse' }} 
        #swagger.parameters["q"] = { in : 'query', type : 'string' }
        #swagger.parameters["page"] = { in : 'query', type : 'number' }
        #swagger.parameters["size"] = { in : 'query', type : 'number' }
        #swagger.parameters["user_id"] = { in : 'query', type : 'string' }
        #swagger.parameters["order"] = { in : 'query', type : 'string', description : "asc or desc" }
    */
  return await controller.listWallets(req, res);
});
routes.get("/dashboard", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = "Financial dashboard"
        #swagger.responses[200] = {schema: { $ref: '#/definitions/StaffFinanceDashboardResponse' }} 
    */
  return await controller.dashboard(req, res);
});
routes.get("/:id", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = "Get transaction"
        #swagger.responses[200] = {schema: { $ref: '#/definitions/StaffGetTransactionResponse' }} 
    */
  return await controller.getTransaction(req, res);
});
routes.get("/", async (req: any, res: Response): Promise<Response> => {
  /*
        #swagger.description = "List transactions"
        #swagger.responses[200] = {schema: { $ref: '#/definitions/StaffListTransactionsResponse' }} 
        #swagger.parameters["q"] = { in : 'query', type : 'string' }
        #swagger.parameters["page"] = { in : 'query', type : 'number' }
        #swagger.parameters["size"] = { in : 'query', type : 'number' }
        #swagger.parameters["user_id"] = { in : 'query', type : 'string' }
        #swagger.parameters["transaction_type"] = { in : 'query', type : 'string' }
        #swagger.parameters["transaction_status"] = { in : 'query', type : 'string' }
        #swagger.parameters["period"] = { in : 'query', type : 'string' }
        #swagger.parameters["payment_method"] = { in : 'query', type : 'string' }
        #swagger.parameters["min_amount"] = { in : 'query', type : 'string' }
        #swagger.parameters["order"] = { in : 'query', type : 'string', description : "asc or desc" }
    */
  return await controller.listTransactions(req, res);
});

export default routes;
