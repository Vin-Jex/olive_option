import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { sequelize } from "./config/database";
import { log } from "./utils/logger";
import { messages } from "./utils/consts";
import env from "./config/config";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "../swagger-output-0044556661.json";
import http from "http";
import { StatusCodes } from "http-status-codes";
import userRoutes from "./routes/user.routes";
import optionsRoutes from "./routes/options.routes";
import walletRoutes from "./routes/wallet.routes";
import tradesRoutes from "./routes/trades.routes";
import staffRoutes from "./routes/staff.routes";
import alertRoutes from "./routes/alert.routes";
import affiliateRoutes from "./routes/Affiliate/Affiliate.Route";
import AffiliateUserRouter from "./routes/Affiliate/AffiliateUser.Route";
import PromoCodeRoutes from "./routes/Affiliate/PromoCode.Route";
import AffiliateLinkRoutes from "./routes/Affiliate/Link.Route";
import AffiliateProgramRoutes from "./routes/Affiliate/AffiliateProgram.Route";
import AffiliateLinkTypeRoutes from "./routes/Affiliate/LinkType.Route";
import AffiliateClickRouter from "./routes/Affiliate/AffiliateClicks.Route";
import AffiliateActivityRouter from "./routes/Affiliate/AffiliateUserActivity.Route";
import AffiliateTelegramLinkRoutes from "./routes/Affiliate/AffiliateTelegramLinks.Route";
import { seedAdmin } from "./config/seed";
import "./utils/Affiliate/telegramBot";
import axios from "axios";
import { CreateAffiliateTelegramLinkController } from "./controllers/Affiliate/AffiliateTelegramLinks.Controller";
import PostbackRouter from "./routes/Affiliate/AffiliatePostbacks.Route";
import SupportRouter from "./routes/Affiliate/AffiliateSupport.Route";
import SumSubWebhookRouter from "./routes/sumsub-webhook.route";
import { initWs } from "./config/ws";
import "./jobs/topAffiliatesJob";
// import { registerSumsubWebhook } from "./utils/sumsub";
import KYCVerificationRouter from "./routes/KYCVerification.Route";

const app: Express = express();

const { SERVER_URL, TELEGRAM_BOT_TOKEN } = env;
export const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
export const TELEGRAM_URL = `/webhook/${TELEGRAM_BOT_TOKEN}`;
const WEBHOOK_URL = `${SERVER_URL}${TELEGRAM_URL}`;

// (async () => {
//   try {
//     const response = await registerSumsubWebhook(
//       `${SERVER_URL}/webhooks/sumsub`
//     );
//     console.log("✅ Webhook registered:", response);
//   } catch (error) {
//     console.error("❌ Failed to register sumsub webhook:", error);
//   }
// })();

const initTelegram = async () => {
  try {
    const res = await axios.get(
      `${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`
    );
    log("info", res.data);
  } catch (error) {
    log("error", { error });
  }
};

app.use(
  cors({
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "accessToken",
      "refreshToken",
    ],
    exposedHeaders: ["accessToken", "refreshToken"],
    origin: "*",
  })
);

app.use(express.json({ limit: "50mb" }));

export const server = http.createServer(app);
initWs(server);

if (env.NODE_ENV !== "production") {
  app.get("/swagger.json", (req: Request, res: Response): void => {
    /*
      #swagger.ignore = true
    */
    return res.download("swagger-output-0044556661.json");
  });
  app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));
  sequelize
    .sync({ alter: true })
    .then(async () => {
      log("info", messages.DB_CONNECTED);
      await seedAdmin();
      await initTelegram();

      server.listen(env.PORT, () => {
        log("info", messages.SERVER_STARTED);
      });
    })
    .catch((err) => {
      log("error", { message: messages.SERVER_FAILED_TO_START, err });
    });
} else {
  sequelize
    .authenticate()
    .then(async () => {
      log("info", messages.DB_CONNECTED);
      server.listen(env.PORT, () => {
        log("info", messages.SERVER_STARTED);
      });
    })
    .catch((err) => {
      log("error", { message: messages.SERVER_FAILED_TO_START, err });
    });
}

if (!fs.existsSync("uploads_tmp/")) {
  fs.mkdirSync("uploads_tmp");
}

app.get("/health", async (req, res) => {
  /* 
    #swagger.ignore = true
  */

  try {
    await sequelize.authenticate();
    res.json({ ok: true });
  } catch (error) {
    return res.json({ ok: false });
  }
});

// app.use((req : Request, res : Response, next : NextFunction) => {
/* 
    #swagger.ignore = true
  */
//   const { method, url, body, query, params } = req;
//   console.log("info",{
//     method,
//     url,
//     body,
//     query,
//     params,
//   });
//   next();
// })

app.use(
  "/user",
  userRoutes
  /* 
    #swagger.tags = ['User']
    #swagger.responses[200] = {schema: { $ref: '#/definitions/RequestSuccessful' }}  
    #swagger.responses[400] = {schema: { $ref: '#/definitions/BadRequest' }}  
    #swagger.responses[500] = {schema: { $ref: '#/definitions/InternalServerError' }}  
    #swagger.responses[401] = {schema: { $ref: '#/definitions/Unauthorized', ifStatusPresent : true }}  
    #swagger.responses[403] = {schema: { $ref: '#/definitions/Forbidden', ifStatusPresent : true }}  
  */
);
app.use(
  "/options",
  optionsRoutes
  /* 
    #swagger.tags = ['Options']
    #swagger.responses[200] = {schema: { $ref: '#/definitions/RequestSuccessful' }}  
    #swagger.responses[400] = {schema: { $ref: '#/definitions/BadRequest' }}  
    #swagger.responses[500] = {schema: { $ref: '#/definitions/InternalServerError' }}  
    #swagger.responses[401] = {schema: { $ref: '#/definitions/Unauthorized', ifStatusPresent : true }}  
    #swagger.responses[403] = {schema: { $ref: '#/definitions/Forbidden', ifStatusPresent : true }}  
  */
);
app.use(
  "/trades",
  tradesRoutes
  /* 
    #swagger.tags = ['Trades']
    #swagger.responses[200] = {schema: { $ref: '#/definitions/RequestSuccessful' }}  
    #swagger.responses[400] = {schema: { $ref: '#/definitions/BadRequest' }}  
    #swagger.responses[500] = {schema: { $ref: '#/definitions/InternalServerError' }}  
    #swagger.responses[401] = {schema: { $ref: '#/definitions/Unauthorized', ifStatusPresent : true }}  
    #swagger.responses[403] = {schema: { $ref: '#/definitions/Forbidden', ifStatusPresent : true }}  
  */
);
app.use(
  "/wallet",
  walletRoutes
  /* 
    #swagger.tags = ['Wallet']
    #swagger.responses[200] = {schema: { $ref: '#/definitions/RequestSuccessful' }}  
    #swagger.responses[400] = {schema: { $ref: '#/definitions/BadRequest' }}  
    #swagger.responses[500] = {schema: { $ref: '#/definitions/InternalServerError' }}  
    #swagger.responses[401] = {schema: { $ref: '#/definitions/Unauthorized', ifStatusPresent : true }}  
    #swagger.responses[403] = {schema: { $ref: '#/definitions/Forbidden', ifStatusPresent : true }}  
  */
);
app.use(
  "/alert",
  alertRoutes
  /* 
    #swagger.tags = ['Alert']
    #swagger.responses[200] = {schema: { $ref: '#/definitions/RequestSuccessful' }}  
    #swagger.responses[400] = {schema: { $ref: '#/definitions/BadRequest' }}  
    #swagger.responses[500] = {schema: { $ref: '#/definitions/InternalServerError' }}  
    #swagger.responses[401] = {schema: { $ref: '#/definitions/Unauthorized', ifStatusPresent : true }}  
    #swagger.responses[403] = {schema: { $ref: '#/definitions/Forbidden', ifStatusPresent : true }}  
  */
);

app.use("/staff", staffRoutes);
app.post(TELEGRAM_URL, CreateAffiliateTelegramLinkController);
app.use("/affiliates", affiliateRoutes);
app.use("/affiliate-users", AffiliateUserRouter);
app.use("/affiliate-promo-code", PromoCodeRoutes);
app.use("/affiliate-link", AffiliateLinkRoutes);
app.use("/affiliate-link-type", AffiliateLinkTypeRoutes);
app.use("/affiliate-program-type", AffiliateProgramRoutes);
app.use("/affiliate/telegram", AffiliateTelegramLinkRoutes);
app.use("/affiliate-clicks", AffiliateClickRouter);
app.use("/affiliate-activities", AffiliateActivityRouter);
app.use("/affiliate-postback", PostbackRouter);
app.use(SupportRouter);

app.use("/webhooks", SumSubWebhookRouter);
app.use("/kyc", KYCVerificationRouter);

app.use("*", (req: Request, res: Response): Response => {
  /* 
    #swagger.ignore = true
  */
  return res.status(StatusCodes.NOT_FOUND).json({
    ok: false,
    message: messages.NOT_FOUND,
    status: StatusCodes.NOT_FOUND,
  });
});
