import { Response } from "express";
import {
  deleteKYC,
  getAllKYCs,
  getUserKYC,
  rejectKYC,
  submitKYC,
  verifyKYC,
} from "../services/KYCVerification.Services";
import { TraderCustomRequest } from "../middlewares/auth";

export const submitKYCController = async (
  req: TraderCustomRequest,
  res: Response
) => {
  const {
    user,
    body: { document_type, frontFile, backFile },
  } = req;

  try {
    const service = await submitKYC(
      user?.id!,
      document_type,
      frontFile,
      backFile
    );
    return res.status(service.status).json({ ...service });
  } catch (error: any) {
    return res.status(error.status).json({ ...error });
  }
};

export const getUserKYCController = async (
  req: TraderCustomRequest,
  res: Response
) => {
  const { user } = req;

  try {
    const service = await getUserKYC(user?.id!);
    return res.status(service.status).json({ ...service });
  } catch (error: any) {
    return res.status(error.status).json({ ...error });
  }
};

export const getAllKYCsController = async (
  _req: TraderCustomRequest,
  res: Response
) => {
  try {
    const service = await getAllKYCs();
    return res.status(service.status).json({ ...service });
  } catch (error: any) {
    return res.status(error.status).json({ ...error });
  }
};

export const verifyKYCController = async (
  req: TraderCustomRequest,
  res: Response
) => {
  const { kycId } = req.params;

  try {
    const service = await verifyKYC(kycId);
    return res.status(service.status).json({ ...service });
  } catch (error: any) {
    return res.status(error.status).json({ ...error });
  }
};

export const rejectKYCController = async (
  req: TraderCustomRequest,
  res: Response
) => {
  const { kycId, reason } = req.params;

  try {
    const service = await rejectKYC(kycId, reason);
    return res.status(service.status).json({ ...service });
  } catch (error: any) {
    return res.status(error.status).json({ ...error });
  }
};

export const deleteKYCController = async (
  req: TraderCustomRequest,
  res: Response
) => {
  const { kycId } = req.params;

  try {
    const service = await deleteKYC(kycId);
    return res.status(service.status).json({ ...service });
  } catch (error: any) {
    return res.status(error.status).json({ ...error });
  }
};
