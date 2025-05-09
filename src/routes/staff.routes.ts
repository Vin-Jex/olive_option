import authRoutes from "./staff/auth.routes";
import userRoutes from "./staff/user.routes";
import financeRoutes from "./staff/finance.routes";
import tradeRoutes from "./staff/trade.routes";
import contentRoutes from "./staff/content.routes";
import faqRoutes from "./staff/faq.routes";
import promotionRoutes from './staff/promotion.routes'
import settingRoutes from './staff/setting.routes'
import { Router } from "express";

const routes: Router = Router();

routes.use(
  "/user",
  userRoutes
  /* 
      #swagger.tags = ['Staff:User']
      #swagger.responses[200] = {schema: { $ref: '#/definitions/RequestSuccessful' }}  
      #swagger.responses[400] = {schema: { $ref: '#/definitions/BadRequest' }}  
      #swagger.responses[500] = {schema: { $ref: '#/definitions/InternalServerError' }}  
      #swagger.responses[401] = {schema: { $ref: '#/definitions/Unauthorized', ifStatusPresent : true }}  
      #swagger.responses[403] = {schema: { $ref: '#/definitions/Forbidden', ifStatusPresent : true }}  
  */
);
routes.use(
  "/finance",
  financeRoutes
  /* 
      #swagger.tags = ['Staff:Finance']
    */
);
routes.use(
  "/trade",
  tradeRoutes
  /* 
      #swagger.tags = ['Staff:Trade']
      #swagger.responses[200] = {schema: { $ref: '#/definitions/RequestSuccessful' }}  
    */
);
routes.use(
  "/faq",
  faqRoutes
  /* 
      #swagger.tags = ['Staff:Faq']
      #swagger.responses[200] = {schema: { $ref: '#/definitions/RequestSuccessful' }}  
      #swagger.responses[400] = {schema: { $ref: '#/definitions/BadRequest' }}  
      #swagger.responses[500] = {schema: { $ref: '#/definitions/InternalServerError' }}  
      #swagger.responses[401] = {schema: { $ref: '#/definitions/Unauthorized', ifStatusPresent : true }}  
      #swagger.responses[403] = {schema: { $ref: '#/definitions/Forbidden', ifStatusPresent : true }}  
    */
);
routes.use(
  "/content",
  contentRoutes
  /* 
      #swagger.tags = ['Staff:Content']
      #swagger.responses[200] = {schema: { $ref: '#/definitions/RequestSuccessful' }}  
      #swagger.responses[400] = {schema: { $ref: '#/definitions/BadRequest' }}  
      #swagger.responses[500] = {schema: { $ref: '#/definitions/InternalServerError' }}  
      #swagger.responses[401] = {schema: { $ref: '#/definitions/Unauthorized', ifStatusPresent : true }}  
      #swagger.responses[403] = {schema: { $ref: '#/definitions/Forbidden', ifStatusPresent : true }}  
    */
);
routes.use(
  "/promotion",
  promotionRoutes
  /* 
      #swagger.tags = ['Staff:Promotion']
      #swagger.responses[200] = {schema: { $ref: '#/definitions/RequestSuccessful' }}  
      #swagger.responses[400] = {schema: { $ref: '#/definitions/BadRequest' }}  
      #swagger.responses[500] = {schema: { $ref: '#/definitions/InternalServerError' }}  
      #swagger.responses[401] = {schema: { $ref: '#/definitions/Unauthorized', ifStatusPresent : true }}  
      #swagger.responses[403] = {schema: { $ref: '#/definitions/Forbidden', ifStatusPresent : true }}  
    */
);
routes.use(
  "/setting",
  settingRoutes
  /* 
      #swagger.tags = ['Staff:Setting']
      #swagger.responses[200] = {schema: { $ref: '#/definitions/RequestSuccessful' }}  
      #swagger.responses[400] = {schema: { $ref: '#/definitions/BadRequest' }}  
      #swagger.responses[500] = {schema: { $ref: '#/definitions/InternalServerError' }}  
      #swagger.responses[401] = {schema: { $ref: '#/definitions/Unauthorized', ifStatusPresent : true }}  
      #swagger.responses[403] = {schema: { $ref: '#/definitions/Forbidden', ifStatusPresent : true }}  
    */
);
routes.use(
  "/",
  authRoutes
  /* 
      #swagger.tags = ['Staff:Auth']
      #swagger.responses[200] = {schema: { $ref: '#/definitions/RequestSuccessful' }}  
      #swagger.responses[400] = {schema: { $ref: '#/definitions/BadRequest' }}  
      #swagger.responses[500] = {schema: { $ref: '#/definitions/InternalServerError' }}  
      #swagger.responses[401] = {schema: { $ref: '#/definitions/Unauthorized', ifStatusPresent : true }}  
      #swagger.responses[403] = {schema: { $ref: '#/definitions/Forbidden', ifStatusPresent : true }}  
  */
);

export default routes;
