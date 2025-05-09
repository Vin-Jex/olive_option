import { Request, Response } from "express";
import { log } from "../../utils/logger";
import {
  loginValidation,
  createStaffValidation,
  listStaffsValidation,
  editStaffPermissionValidation,
  getStaffActivitesValidation,
  updateStaffValidation,
} from "../../utils/validations/staff/auth.validation";
import { singleIdValidation } from "../../utils/validations/trades.validation";
import {
  resetPasswordValidation,
  resetVerifyValidation,
  resetOtpValidation,
  changePasswordValidation,
} from "../../utils/validations/user.validation";

import {
  loginService,
  createStaffService,
  listStaffsService,
  getStaffService,
  editStaffPermissionService,
  toggleRoleService,
  toggleStatusService,
  getStaffActivitesService,
  passwordOtpService,
  verifyOtpService,
  resetPasswordService,
  changePasswordService,
  updateStaffService,
} from "../../services/staff/auth.service";

import { dashboardService } from "../../services/staff/general.service";

import { Staff } from "../../models/Staff";

export default {
  dashboard: async (req: Request, res: Response): Promise<Response> => {
    const { ip, url } = req;

    try {
      let service = await dashboardService();
      return res.status(service.status).json({ ...service });
    } catch (error: any) {
      log("error", { error, ip, url });
      return res.status(error.status).json({ ...error });
    }
  },
  passwordReset: async (req: Request, res: Response): Promise<Response> => {
    const { ip, url, body } = req;

    try {
      let payload = resetPasswordValidation(body);
      let service = await resetPasswordService(payload);
      return res.status(service.status).json({ ...service });
    } catch (error: any) {
      log("error", { error, ip, url });
      return res.status(error.status).json({ ...error });
    }
  },
  passwordOtpVerify: async (
    req: Request & { staff: Staff },
    res: Response
  ): Promise<Response> => {
    const { ip, url, staff, body } = req;

    try {
      let payload = resetVerifyValidation(body);
      let service = await verifyOtpService(payload);
      return res.status(service.status).json({ ...service });
    } catch (error: any) {
      log("error", { error, ip, url });
      return res.status(error.status).json({ ...error });
    }
  },
  passwordOtp: async (req: Request, res: Response): Promise<Response> => {
    const { ip, url, body } = req;

    try {
      let payload = resetOtpValidation(body);
      let service = await passwordOtpService(payload);
      return res.status(service.status).json({ ...service });
    } catch (error: any) {
      log("error", { error, ip, url });
      return res.status(error.status).json({ ...error });
    }
  },
  staffActivities: async (
    req: Request & { staff: Staff },
    res: Response
  ): Promise<Response> => {
    const { ip, url, query, params } = req;

    try {
      let payload = getStaffActivitesValidation({ ...params, ...query });
      let service = await getStaffActivitesService(payload);
      return res.status(service.status).json({ ...service });
    } catch (error: any) {
      log("error", { error, ip, url });
      return res.status(error.status).json({ ...error });
    }
  },
  toggleStatus: async (
    req: Request & { staff: Staff },
    res: Response
  ): Promise<Response> => {
    const { ip, url, params } = req;

    try {
      let payload = singleIdValidation(params);
      let service = await toggleStatusService(payload);
      return res.status(service.status).json({ ...service });
    } catch (error: any) {
      log("error", { error, ip, url });
      return res.status(error.status).json({ ...error });
    }
  },
  toggleRole: async (
    req: Request & { staff: Staff },
    res: Response
  ): Promise<Response> => {
    const { ip, url, params } = req;

    try {
      let payload = singleIdValidation(params);
      let service = await toggleRoleService(payload);
      return res.status(service.status).json({ ...service });
    } catch (error: any) {
      log("error", { error, ip, url });
      return res.status(error.status).json({ ...error });
    }
  },
  editStaffPermission: async (
    req: Request & { staff: Staff },
    res: Response
  ): Promise<Response> => {
    const { ip, url, params, body } = req;

    try {
      let payload = editStaffPermissionValidation({ ...params, ...body });
      let service = await editStaffPermissionService(payload);
      return res.status(service.status).json({ ...service });
    } catch (error: any) {
      log("error", { error, ip, url });
      return res.status(error.status).json({ ...error });
    }
  },
  getStaff: async (
    req: Request & { staff: Staff },
    res: Response
  ): Promise<Response> => {
    const { ip, url, params } = req;

    try {
      let payload = singleIdValidation(params);
      let service = await getStaffService(payload);
      return res.status(service.status).json({ ...service });
    } catch (error: any) {
      log("error", { error, ip, url });
      return res.status(error.status).json({ ...error });
    }
  },
  listStaffs: async (
    req: Request & { staff: Staff },
    res: Response
  ): Promise<Response> => {
    const { ip, url, query } = req;

    try {
      let payload = listStaffsValidation(query);
      let service = await listStaffsService(payload);
      return res.status(service.status).json({ ...service });
    } catch (error: any) {
      log("error", { error, ip, url });
      return res.status(error.status).json({ ...error });
    }
  },
  createStaff: async (
    req: Request & { staff: Staff },
    res: Response
  ): Promise<Response> => {
    const { ip, url, body } = req;

    try {
      let payload = createStaffValidation(body);
      let service = await createStaffService(payload);
      return res.status(service.status).json({ ...service });
    } catch (error: any) {
      log("error", { error, ip, url });
      return res.status(error.status).json({ ...error });
    }
  },
  updateStaff: async (
    req: Request & { staff: Staff },
    res: Response
  ): Promise<Response> => {
    const { ip, url, body, staff } = req;

    try {
      let payload = updateStaffValidation(body);
      let service = await updateStaffService(payload, staff);
      return res.status(service.status).json({ ...service });
    } catch (error: any) {
      log("error", { error, ip, url });
      return res.status(error.status).json({ ...error });
    }
  },
  login: async (req: Request, res: Response): Promise<Response> => {
    const { ip, url, body } = req;

    try {
      let payload = loginValidation(body);
      let service = await loginService(payload);
      return res.status(service.status).json({ ...service });
    } catch (error: any) {
      log("error", { error, ip, url });
      return res.status(error.status).json({ ...error });
    }
  },
  changePasswordReset: async (
    req: Request & { staff: Staff },
    res: Response
  ): Promise<Response> => {
    const { ip, url, body, staff } = req;

    try {
      let payload = changePasswordValidation(body);
      let service = await changePasswordService(payload, staff);
      return res.status(service.status).json({ ...service });
    } catch (error: any) {
      log("error", { error, ip, url });
      return res.status(error.status).json({ ...error });
    }
  },
};
