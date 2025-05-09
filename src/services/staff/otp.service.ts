import { compareString, hashString } from "../../utils/auth";
import { messages, otp_destination, staff_otp_types } from "../../utils/consts";
import { StaffOtp } from "../../models/StaffOtp";
import { StatusCodes } from "http-status-codes";
import { sendMail } from "../../utils/mail";
import { Staff } from "../../models/Staff";

export const checkOtp = async (
  staff_id: number,
  type: staff_otp_types,
  otp: string
): Promise<void> => {
  let searchOtp = await StaffOtp.findOne({
    where: { staff_id, type },
    order: [["id", "desc"]],
  });

  if (!searchOtp) {
    throw {
      ok: false,
      message: messages.INVALID_OTP,
      status: StatusCodes.UNAUTHORIZED,
    };
  }

  let createdTime: any = new Date(`${searchOtp.created_at}`);
  createdTime = createdTime.getTime();

  let expiryTime = createdTime + 2 * 60 * 60 * 1000;

  if (expiryTime < new Date().getTime()) {
    await StaffOtp.destroy({ where: { staff_id, type } });
    throw {
      ok: false,
      message: messages.OTP_EXPIRED,
      status: StatusCodes.BAD_REQUEST,
    };
  }

  if (!compareString(otp, searchOtp.token)) {
    throw {
      ok: false,
      message: messages.INVALID_OTP,
      status: StatusCodes.UNAUTHORIZED,
    };
  }
};

export const verifyOtp = async (
  otp: string,
  staff_id: number,
  type: staff_otp_types
): Promise<void> => {
  await checkOtp(staff_id, type, otp);
  await StaffOtp.destroy({ where: { staff_id, type } });
};

export const generateVerifyEmailOtp = (
  otp: string,
  type: staff_otp_types
): { subject: string; text: string; html?: string } => {
  switch (type) {
    case staff_otp_types.reset_password:
      return {
        subject: "Reset Password",
        text: `Hi,\nPlease reset your password using ${otp}\nThank you.`,
        html: `<p>Hi,</p>\n<p>Please reset your password using <b>${otp}</b></p>\n<p>Thank you.</p>`,
      };
    default:
      return { subject: "", text: "" };
  }
};

export const sendOtpService = async (
  staff: Staff,
  type: staff_otp_types,
  otp: string,
  phone: string | undefined,
  email: string | undefined
): Promise<void> => {
  let token = hashString(otp);
  const staff_id = staff.id;

  let searchLastOtp = await StaffOtp.findOne({
    where: { staff_id, type },
    order: [["id", "desc"]],
  });

  if (searchLastOtp) {
    let createdTime: any = new Date(`${searchLastOtp.created_at}`);
    createdTime = createdTime.getTime();

    let resendTime = createdTime + 2 * 60 * 1000;

    if (
      resendTime > new Date().getTime() &&
      (searchLastOtp.receiver == phone || searchLastOtp.receiver == email)
    ) {
      throw {
        ok: false,
        message: messages.RESEND_TO_EARLY,
        status: StatusCodes.BAD_REQUEST,
      };
    }
  }

  await StaffOtp.destroy({ where: { staff_id, type } });

  if (email) {
    let { subject, text, html } = generateVerifyEmailOtp(otp, type);

    try {
      await sendMail({
        to: [email],
        subject,
        text,
        html: html ? html : "",
      });
      await StaffOtp.create({
        staff_id,
        type,
        destination: otp_destination.email,
        token,
        receiver: email,
      });
    } catch (error: any) {
      throw error;
    }
  }
};
