export interface SignupType {
  email: string;
  password: string;
}

export interface UpdateUserDetailsType {
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: Date;
  country?: string;
}

export interface UpdateUserSettingsType {
  language?: string;
  enable_sound?: boolean;
  email_notification?: boolean;
}

export interface ChangePasswordType {
  old_password: string;
  new_password: string;
}

export interface ResetOtpType {
  email: string;
}

export interface ResetVerifyType {
  email: string;
  otp: string;
}

export interface ResetPasswordType {
  token: string;
  password: string;
}

export interface VerifyOtpType {
  otp: string;
}

export enum DocumentTypes {
  Passport = "Passport",
  DriverLicense = "DriverLicense",
  NationalId = "NationalId",
  ResidencePermit = "ResidencePermit",
}

export type DocumentType = keyof typeof DocumentTypes;

export type SumsubDocSide = "FRONT" | "BACK";

export type SumsubDocumentType =
  | "PASSPORT"
  | "DRIVERS"
  | "ID_CARD"
  | "RESIDENCE_PERMIT";

export const mapToSumsubDocumentType: Record<
  DocumentTypes,
  SumsubDocumentType
> = {
  [DocumentTypes.Passport]: "PASSPORT",
  [DocumentTypes.DriverLicense]: "DRIVERS",
  [DocumentTypes.NationalId]: "ID_CARD",
  [DocumentTypes.ResidencePermit]: "RESIDENCE_PERMIT",
};

export type UploadDocumentOptions = {
  applicantId: string;
  filePath: string;
  fileName: string;
  documentType: SumsubDocumentType;
  country: string;
  side: SumsubDocSide;
};
