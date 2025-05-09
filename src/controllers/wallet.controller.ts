import { Request, Response } from "express";
import { log } from "../utils/logger";
import {
  listTransactionsValidation,
  initFundWalletValidation,
  initPayoutValidation,
} from "../utils/validations/wallet.validation";
import {
  getWalletService,
  resetWalletService,
  listTransactionsService,
  getTransactionService,
  initFundWalletService,
  initPayoutService,
  nowpayPaymentCallbackService,
} from "../services/wallet.service";
import { User } from "../models/User";
import { singleIdValidation } from "../utils/validations/trades.validation";
import { AffiliateUser } from "../models/Affiliate/AffiliateUser.Model";

export default {
  getTransaction: async (
    req: Request & { user: User | (AffiliateUser & { livemode: boolean }) },
    res: Response
  ): Promise<Response> => {
    const { ip, url, params, user } = req;

    try {
      let payload = singleIdValidation(params);
      let service = await getTransactionService(
        payload,
        user,
        req.query.user_type ? req.query.user_type : undefined
      );
      return res.status(service.status).json({ ...service });
    } catch (error: any) {
      console.log(error);
      log("error", { error, ip, url });
      return res.status(error.status).json({ ...error });
    }
  },
  transactions: async (
    req: Request & { user: User | (AffiliateUser & { livemode: boolean }) },
    res: Response
  ): Promise<Response> => {
    const { ip, url, query, user } = req;

    try {
      let payload = listTransactionsValidation(query);
      let service = await listTransactionsService(payload, user);
      return res.status(service.status).json({ ...service });
    } catch (error: any) {
      console.log(error);
      log("error", { error, ip, url });
      return res.status(error.status).json({ ...error });
    }
  },
  getWallet: async (
    req: Request & { user: User | (AffiliateUser & { livemode: boolean }) },
    res: Response
  ): Promise<Response> => {
    const { ip, url, user } = req;

    try {
      let service = await getWalletService(
        user,
        req.query.user_type ? req.query.user_type : undefined
      );
      return res.status(service.status).json({ ...service });
    } catch (error: any) {
      console.log(error);
      log("error", { error, ip, url });
      return res.status(error.status).json({ ...error });
    }
  },
  resetWallet: async (
    req: Request & { user: User },
    res: Response
  ): Promise<Response> => {
    const { ip, url, user } = req;

    try {
      let service = await resetWalletService(user);
      return res.status(service.status).json({ ...service });
    } catch (error: any) {
      console.log(error);
      log("error", { error, ip, url });
      return res.status(error.status).json({ ...error });
    }
  },
  initFundWallet: async (
    req: Request & { user: User | (AffiliateUser & { livemode: boolean }) },
    res: Response
  ): Promise<Response> => {
    const { ip, url, body, user } = req;

    try {
      let payload = initFundWalletValidation(body);
      let service = await initFundWalletService(payload, user);
      return res.status(service.status).json({ ...service });
    } catch (error: any) {
      console.log(error);
      log("error", { error, ip, url });
      return res.status(error.status).json({ ...error });
    }
  },
  initPayout: async (
    req: Request & { user: User | (AffiliateUser & { livemode: boolean }) },
    res: Response
  ): Promise<Response> => {
    const { ip, url, body, user } = req;

    try {
      let payload = initPayoutValidation(body);
      let service = await initPayoutService(payload, user);
      return res.status(service.status).json({ ...service });
    } catch (error: any) {
      console.log(error);
      log("error", { error, ip, url });
      return res.status(error.status).json({ ...error });
    }
  },
  nowpayPaymentCallback: async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { ip, url, body } = req;

    try {
      let service = await nowpayPaymentCallbackService(body);
      return res.status(service.status).json({ ...service });
    } catch (error: any) {
      console.log(error);
      log("error", { error, ip, url });
      return res.status(error.status).json({ ...error });
    }
  },
};
