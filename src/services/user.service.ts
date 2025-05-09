import { FileUploadType, ResponseType } from "../types/api.types";
import {
  bucket_folders,
  messages,
  otp_types,
  user_roles,
} from "../utils/consts";
import { StatusCodes } from "http-status-codes";
import {
  ChangePasswordType,
  ResetOtpType,
  ResetPasswordType,
  ResetVerifyType,
  SignupType,
  UpdateUserDetailsType,
  UpdateUserSettingsType,
  VerifyOtpType,
} from "../types/user.types";
import { User } from "../models/User";
import { checkOtp, sendOtpService, verifyOtp } from "../services/otp.service";
import {
  compareString,
  decryptString,
  encryptString,
  generateRandomNumber,
  hashString,
  signObject,
} from "../utils/auth";
import { log } from "../utils/logger";
import env from "../config/config";
import { UserSetting } from "../models/UserSetting";
import fs from "fs";
import { uploadFile } from "../utils/file";

export const verifyOtpService = async (
  payload: VerifyOtpType,
  user: User
): Promise<ResponseType> => {
  let { otp } = payload;

  await verifyOtp(otp, user.id, otp_types.verify_email);

  user.is_email_verified = true;
  await user.save();

  return { ok: true, message: messages.OK, status: StatusCodes.OK };
};

export const resetPasswordService = async (
  payload: ResetPasswordType
): Promise<ResponseType> => {
  const { password, token } = payload;

  let decryptedString: string;

  try {
    decryptedString = decryptString(token);
  } catch (error: any) {
    log("error", { error });
    throw {
      ok: false,
      message: messages.UNAUTHORIZED,
      status: StatusCodes.UNAUTHORIZED,
    };
  }

  let split = decryptedString.split("~~~");
  let otp = split[0];
  let user_id = split[1];

  let user = await User.findOne({ where: { id: user_id } });

  if (!user) {
    throw {
      ok: false,
      message: messages.UNAUTHORIZED,
      status: StatusCodes.UNAUTHORIZED,
    };
  }

  await verifyOtp(otp, user.id, otp_types.reset_password);

  user.password_hash = hashString(password);
  await user.save();

  return { ok: true, message: messages.OK, status: StatusCodes.OK };
};

export const resetVerifyService = async (
  payload: ResetVerifyType,
  otp_type: otp_types = otp_types.reset_password
): Promise<ResponseType> => {
  const { email, otp } = payload;

  let user = await User.findOne({ where: { email } });

  if (!user) {
    throw {
      ok: false,
      message: messages.UNAUTHORIZED,
      status: StatusCodes.UNAUTHORIZED,
    };
  }

  await checkOtp(user.id, otp_type, otp);

  let token = encryptString(`${otp}~~~${user.id}`);

  return {
    ok: true,
    message: messages.OK,
    status: StatusCodes.OK,
    body: { token },
  };
};

export const resetOtpService = async (
  payload: ResetOtpType,
  otp_type: otp_types = otp_types.reset_password
): Promise<ResponseType> => {
  let { email } = payload;

  let user = await User.findOne({ where: { email } });

  if (!user) {
    throw {
      ok: false,
      message: messages.UNAUTHORIZED,
      status: StatusCodes.UNAUTHORIZED,
    };
  }

  try {
    await sendOtpService(
      user,
      otp_type,
      generateRandomNumber(4),
      undefined,
      email
    );
  } catch (error: any) {
    log("error", { message: { ...error } });
    throw {
      ok: false,
      message: messages.SERVER_ERROR,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }

  return { ok: true, message: messages.OK, status: StatusCodes.OK };
};

export const signupService = async (
  payload: SignupType
): Promise<ResponseType> => {
  let { email, password } = payload;

  let search = await User.findOne({ where: { email } });

  if (search) {
    throw {
      ok: false,
      message: messages.USER_ALREADY_EXIST,
      status: StatusCodes.BAD_REQUEST,
    };
  }

  password = hashString(password);

  let user = await User.create({
    email,
    password_hash: password,
    role: user_roles.user,
  });

  try {
    await sendOtpService(
      user,
      otp_types.verify_email,
      generateRandomNumber(4),
      undefined,
      email
    );
  } catch (error: any) {
    await User.destroy({ where: { id: user.id } });
    log("error", { message: { ...error } });
    throw {
      ok: false,
      message: messages.SERVER_ERROR,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    };
  }

  await UserSetting.create({ user_id: user.id });

  return { ok: true, message: messages.OK, status: StatusCodes.OK };
};

export const loginService = async (
  payload: SignupType
): Promise<ResponseType> => {
  const { email, password } = payload;

  let search = await User.findOne({ where: { email } });

  if (!search) {
    throw {
      ok: false,
      message: messages.INVALID_LOGIN_CRED,
      status: StatusCodes.UNAUTHORIZED,
    };
  }

  let check = compareString(password, search.password_hash);

  if (!check) {
    throw {
      ok: false,
      message: messages.INVALID_LOGIN_CRED,
      status: StatusCodes.UNAUTHORIZED,
    };
  }

  let authExpiration = env.NODE_ENV !== "production" ? "3h" : "20m";
  let refreshExpiration = env.NODE_ENV !== "production" ? "150m" : "25m";

  let auth = signObject({ user_id: search.id }, authExpiration);
  let refresh = signObject({ user_id: search.id }, refreshExpiration);

  await User.update(
    { last_login_at: new Date() },
    { where: { id: search.id } }
  );

  return {
    ok: true,
    message: messages.OK,
    status: StatusCodes.OK,
    body: { tokens: { auth, refresh } },
  };
};

export const meService = async (user: User): Promise<ResponseType> => {
  let newUser = await User.findOne({
    attributes: { exclude: ["password_hash"] },
    where: { id: user.id },
    include: [{ model: UserSetting, as: "settings" }],
  });

  return {
    ok: true,
    message: messages.OK,
    status: StatusCodes.OK,
    body: { user: newUser },
  };
};

export const refreshService = async (user: User): Promise<ResponseType> => {
  let authExpiration = env.NODE_ENV !== "production" ? "3h" : "20m";
  let refreshExpiration = env.NODE_ENV !== "production" ? "150m" : "25m";

  let auth = signObject({ user_id: user.id }, authExpiration);
  let refresh = signObject({ user_id: user.id }, refreshExpiration);

  return {
    ok: true,
    message: messages.OK,
    status: StatusCodes.OK,
    body: { tokens: { auth, refresh } },
  };
};

export const updateUserDetailsService = async (
  payload: UpdateUserDetailsType & any,
  user: User & any
): Promise<ResponseType> => {
  let keys = Object.keys(payload);

  for (let i = 0; i < keys.length; i++) {
    user[keys[i]] = payload[keys[i]];
  }

  await user.save();

  return await meService(user);
};

export const updateUserSettingsService = async (
  payload: UpdateUserSettingsType & any,
  user: User
): Promise<ResponseType> => {
  let setting: any = await UserSetting.findOne({ where: { user_id: user.id } });
  let keys = Object.keys(payload);

  for (let i = 0; i < keys.length; i++) {
    setting[keys[i]] = payload[keys[i]];
  }

  await setting.save();

  return await meService(user);
};

export const changePasswordService = async (
  payload: ChangePasswordType,
  user: User
): Promise<ResponseType> => {
  const { old_password, new_password } = payload;

  let check = compareString(old_password, user.password_hash);

  if (!check) {
    throw {
      ok: false,
      message: messages.UNAUTHORIZED,
      status: StatusCodes.UNAUTHORIZED,
    };
  }

  user.password_hash = hashString(new_password);
  await user.save();

  return { ok: true, message: messages.OK, status: StatusCodes.OK };
};

export const uploadProfilePicService = async (
  payload: FileUploadType,
  user: User
): Promise<ResponseType> => {
  let file = payload;
  let buffer = fs.readFileSync(file.path);

  let url = await uploadFile(
    bucket_folders.profile_pics,
    buffer,
    file.filename
  );

  user.pfp_url = url;
  await user.save();

  return await meService(user);
};

export const toggleLiveService = async (user: User): Promise<ResponseType> => {
  user.livemode = !user.livemode;
  await user.save();

  return await meService(user);
};
