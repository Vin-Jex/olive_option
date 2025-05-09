import { Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { messages } from "../utils/consts";
import { log } from "../utils/logger";
import { extractSignature } from "../utils/auth";
import { Staff } from "../models/Staff";
import { StaffPermission } from "../models/StaffPermission";

export const adminOnly = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  let staff = req.staff;

  if (!staff) {
    return res.status(StatusCodes.FORBIDDEN).json({
      ok: false,
      message: messages.FORBIDDEN,
      status: StatusCodes.FORBIDDEN,
    });
  }

  if (!staff.is_admin) {
    return res.status(StatusCodes.FORBIDDEN).json({
      ok: false,
      message: messages.FORBIDDEN,
      status: StatusCodes.FORBIDDEN,
    });
  }

  next();
};

export const verifyStaff = async (
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
  let staff: Staff | null;

  try {
    let verifiedObject = extractSignature(authToken);
    staff = await Staff.findOne({ where: { id: verifiedObject.staff_id } });
  } catch (error: any) {
    log("error", error);
    return res.status(StatusCodes.FORBIDDEN).json({
      ok: false,
      message: messages.FORBIDDEN,
      status: StatusCodes.FORBIDDEN,
    });
  }

  if (!staff) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      ok: false,
      message: messages.UNAUTHORIZED,
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  if (!staff.is_active) {
    return res.status(StatusCodes.FORBIDDEN).json({
      ok: false,
      message: messages.ACCOUNT_SUSPENDED,
      status: StatusCodes.FORBIDDEN,
    });
  }

  req["staff"] = staff;
  next();
};

export const financeStaff = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  let staff = req.staff;

  if (!staff) {
    return res.status(StatusCodes.FORBIDDEN).json({
      ok: false,
      message: messages.FORBIDDEN,
      status: StatusCodes.FORBIDDEN,
    });
  }

  let permission = await StaffPermission.findOne({
    where: { staff_id: staff.id },
  });

  if (!permission) {
    return res.status(StatusCodes.FORBIDDEN).json({
      ok: false,
      message: messages.FORBIDDEN,
      status: StatusCodes.FORBIDDEN,
    });
  }

  if (!permission.financial && !staff.is_admin) {
    return res.status(StatusCodes.FORBIDDEN).json({
      ok: false,
      message: messages.FORBIDDEN,
      status: StatusCodes.FORBIDDEN,
    });
  }

  next();
};

export const userStaff = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  let staff = req.staff;

  if (!staff) {
    return res.status(StatusCodes.FORBIDDEN).json({
      ok: false,
      message: messages.FORBIDDEN,
      status: StatusCodes.FORBIDDEN,
    });
  }

  let permission = await StaffPermission.findOne({
    where: { staff_id: staff.id },
  });

  if (!permission) {
    return res.status(StatusCodes.FORBIDDEN).json({
      ok: false,
      message: messages.FORBIDDEN,
      status: StatusCodes.FORBIDDEN,
    });
  }

  if (!permission.user && !staff.is_admin) {
    return res.status(StatusCodes.FORBIDDEN).json({
      ok: false,
      message: messages.FORBIDDEN,
      status: StatusCodes.FORBIDDEN,
    });
  }

  next();
};

export const tradeStaff = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  let staff = req.staff;

  if (!staff) {
    return res.status(StatusCodes.FORBIDDEN).json({
      ok: false,
      message: messages.FORBIDDEN,
      status: StatusCodes.FORBIDDEN,
    });
  }

  let permission = await StaffPermission.findOne({
    where: { staff_id: staff.id },
  });

  if (!permission) {
    return res.status(StatusCodes.FORBIDDEN).json({
      ok: false,
      message: messages.FORBIDDEN,
      status: StatusCodes.FORBIDDEN,
    });
  }

  if (!permission.trade && !staff.is_admin) {
    return res.status(StatusCodes.FORBIDDEN).json({
      ok: false,
      message: messages.FORBIDDEN,
      status: StatusCodes.FORBIDDEN,
    });
  }

  if (!permission.trade && !staff.is_admin) {
    return res.status(StatusCodes.FORBIDDEN).json({
      ok: false,
      message: messages.FORBIDDEN,
      status: StatusCodes.FORBIDDEN,
    });
  }

  next();
};

export const promotionalStaff = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  let staff = req.staff;

  if (!staff) {
    return res.status(StatusCodes.FORBIDDEN).json({
      ok: false,
      message: messages.FORBIDDEN,
      status: StatusCodes.FORBIDDEN,
    });
  }

  let permission = await StaffPermission.findOne({
    where: { staff_id: staff.id },
  });

  if (!permission) {
    return res.status(StatusCodes.FORBIDDEN).json({
      ok: false,
      message: messages.FORBIDDEN,
      status: StatusCodes.FORBIDDEN,
    });
  }

  if (!permission.promotional && !staff.is_admin) {
    return res.status(StatusCodes.FORBIDDEN).json({
      ok: false,
      message: messages.FORBIDDEN,
      status: StatusCodes.FORBIDDEN,
    });
  }

  next();
};
