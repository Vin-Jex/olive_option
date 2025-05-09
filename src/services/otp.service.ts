import { compareString, hashString } from "../utils/auth";
import { messages, otp_destination, otp_types } from "../utils/consts";
import { Otp } from "../models/Otp";
import { StatusCodes } from "http-status-codes";
import { sendMail } from "../utils/mail";
import { User } from "../models/User";

export const checkOtp = async (
  user_id: string,
  type: otp_types,
  otp: string
): Promise<void> => {
  let searchOtp = await Otp.findOne({
    where: { user_id, type },
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
    await Otp.destroy({ where: { user_id, type } });
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
  user_id: string,
  type: otp_types
): Promise<void> => {
  await checkOtp(user_id, type, otp);
  await Otp.destroy({ where: { user_id, type } });
};

export const generateVerifyEmailOtp = (
  otp: string,
  type: otp_types
): { subject: string; text: string; html?: string } => {
  switch (type) {
    case otp_types.verify_email:
      return {
        subject: "Verify Email",
        text: `Hi,\nPlease verify your account using ${otp}\nThank you.`,
        html: `<p>Hi,</p>\n<p>Please verify your account using <b>${otp}</b></p>\n<p>Thank you.</p>`,
      };
    case otp_types.reset_password:
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
  user: User,
  type: otp_types,
  otp: string,
  phone: string | undefined,
  email: string | undefined
): Promise<void> => {
  let token = hashString(otp);
  const user_id = user.id;

  let searchLastOtp = await Otp.findOne({
    where: { user_id, type },
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

  await Otp.destroy({ where: { user_id, type } });

  if (email) {
    let { subject, text, html } = generateVerifyEmailOtp(otp, type);

    try {
      await sendMail({
        to: [email],
        subject,
        text,
        html: html ? html : "",
      });
      await Otp.create({
        user_id,
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
