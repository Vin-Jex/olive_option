import { Response, Request, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/User";
import { messages, user_roles } from "../utils/consts";
import { log } from "../utils/logger";
import { extractSignature } from "../utils/auth";
import crypto from "crypto";
import env from "../config/config";
import { AffiliateUser } from "../models/Affiliate/AffiliateUser.Model";


export interface TraderCustomRequest extends Request {
  user?: User;
}

export const allowOnlyLiveMode = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  if (
    req.body.user_type == user_roles.user ||
    req.query.user_type == user_roles.user
  ) {
    if (!req?.user?.livemode) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        ok: false,
        message: messages.ONLY_LIVE,
        status: StatusCodes.UNAUTHORIZED,
      });
    }
  }

  next();
};

export const allowOnlyDemoMode = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  if (req?.user?.livemode) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      ok: false,
      message: messages.ONLY_DEMO,
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  next();
};

export const allowUserOrAffiliate = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  let headers = req.headers;
  let authToken = headers.authorization;

  if (authToken.startsWith("Bearer ")) {
    authToken = authToken.replace("Bearer ", "");
  }

  if (!authToken) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      ok: false,
      message: messages.UNAUTHORIZED,
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  let user: User | AffiliateUser | null;

  try {
    let verifiedObject = extractSignature(authToken);

    if (verifiedObject.user_id) {
      user = await User.findOne({ where: { id: verifiedObject.user_id } });
      req.body.user_type = user_roles.user;
      req.query.user_type = user_roles.user;
    } else {
      if (!verifiedObject.sub) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          ok: false,
          message: messages.UNAUTHORIZED,
          status: StatusCodes.UNAUTHORIZED,
        });
      } else {
        let splitSub = verifiedObject.sub.split("-");

        if (!splitSub[1] || splitSub[0] != "AFFILIATE") {
          return res.status(StatusCodes.UNAUTHORIZED).json({
            ok: false,
            message: messages.UNAUTHORIZED,
            status: StatusCodes.UNAUTHORIZED,
          });
        } else {
          console.log(splitSub);
          let idJoined = splitSub.slice(1).join("-");
          user = await AffiliateUser.findOne({ where: { id: idJoined } });
          req.body.user_type = user_roles.affiliate;
          req.query.user_type = user_roles.affiliate;
        }
      }
    }
  } catch (error: any) {
    console.log(error);
    log("error", error);
    return res.status(StatusCodes.FORBIDDEN).json({
      ok: false,
      message: messages.FORBIDDEN,
      status: StatusCodes.FORBIDDEN,
    });
  }

  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      ok: false,
      message: messages.UNAUTHORIZED,
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  req["user"] = user;
  next();
};

export const verifyUser = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  let headers = req.headers;
  let authToken = headers.authorization;

  if (!authToken) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      ok: false,
      message: messages.UNAUTHORIZED,
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  authToken = authToken.replace("Bearer ", "");
  let user: User | null;

  try {
    let verifiedObject = extractSignature(authToken);
    user = await User.findOne({ where: { id: verifiedObject.user_id } });
  } catch (error: any) {
    log("error", error);
    return res.status(StatusCodes.FORBIDDEN).json({
      ok: false,
      message: messages.FORBIDDEN,
      status: StatusCodes.FORBIDDEN,
    });
  }

  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      ok: false,
      message: messages.UNAUTHORIZED,
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  req["user"] = user;
  next();
};

export const nowPayWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  let headers: any = req.headers;

  if (!headers["x-nowpayments-sig"]) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({
        ok: false,
        message: messages.UNAUTHORIZED,
        status: StatusCodes.UNAUTHORIZED,
      });
  }

  let sig = headers["x-nowpayments-sig"];

  function sortObject(obj: any) {
    return Object.keys(obj)
      .sort()
      .reduce((result: any, key: any) => {
        result[key] =
          obj[key] && typeof obj[key] === "object"
            ? sortObject(obj[key])
            : obj[key];
        return result;
      }, {});
  }

  const hmac = crypto.createHmac("sha512", env.NOWPAY_NOTIFICATION_KEY);
  hmac.update(JSON.stringify(sortObject(req.body)));
  const signature = hmac.digest("hex");

  if (signature != sig) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({
        ok: false,
        message: messages.UNAUTHORIZED,
        status: StatusCodes.UNAUTHORIZED,
      });
  }
  next();
};
