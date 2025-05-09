import { User } from "../models/User";
import { KYCVerification } from "../models/KYCVerification.Model";
import { StatusCodes } from "http-status-codes";
import { bucket_folders, messages } from "../utils/consts";
import { deleteFile, uploadFile } from "../utils/file";
import { FileUploadType } from "../types/api.types";
import fs from "fs";
import { createSumsubApplicant, uploadDocumentToSumsub } from "../utils/sumsub";
import { DocumentType, mapToSumsubDocumentType } from "../types/user.types";
import { convertTo3LetterCountryCode } from "../utils/convert-country-to-code";

export async function submitKYC(
  userId: string,
  document_type: DocumentType,
  frontFile: FileUploadType,
  backFile?: FileUploadType
) {
  try {
    const existing = await KYCVerification.findOne({
      where: { user_id: userId, status: "pending" },
    });
    if (existing) {
      return {
        ok: false,
        message: "You already have a pending KYC submission",
        status: StatusCodes.BAD_REQUEST,
        body: null,
      };
    }

    // Fetch user and normalize country
    const user = await User.findByPk(userId);
    if (!user || !user.country) {
      return {
        ok: false,
        message: "User not found or missing country information",
        status: StatusCodes.BAD_REQUEST,
        body: null,
      };
    }
    const country = convertTo3LetterCountryCode(user.country);
    if (!country) {
      return {
        ok: false,
        message: "Invalid country code or country name provided",
        status: StatusCodes.BAD_REQUEST,
        body: null,
      };
    }

    const frontBuffer = fs.readFileSync(frontFile.path);
    const frontUrl = await uploadFile(
      bucket_folders.kyc_documents,
      frontBuffer,
      frontFile.filename
    );

    let backUrl: string | null = null;
    if (backFile) {
      const backBuffer = fs.readFileSync(backFile.path);
      backUrl = await uploadFile(
        bucket_folders.kyc_documents,
        backBuffer,
        backFile.filename
      );
    }

    const kyc = await KYCVerification.create({
      user_id: userId,
      document_type,
      document_front_url: frontUrl,
      document_back_url: backUrl,
      submitted_at: new Date(),
    });

    await createSumsubApplicant(userId);

    // Upload front document
    await uploadDocumentToSumsub({
      applicantId: userId,
      filePath: frontFile.path,
      fileName: frontFile.filename,
      documentType: mapToSumsubDocumentType[document_type],
      country: user.country,
      side: "FRONT",
    });

    if (backFile) {
      await uploadDocumentToSumsub({
        applicantId: userId,
        filePath: backFile.path,
        fileName: backFile.filename,
        documentType: mapToSumsubDocumentType[document_type],
        country: user.country,
        side: "BACK",
      });
    }

    return {
      ok: true,
      message: messages.OK,
      status: StatusCodes.CREATED,
      body: kyc,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error.message || messages.INTERNAL_SERVER_ERROR,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
}

export async function getUserKYC(userId: string) {
  try {
    const kyc = await KYCVerification.findOne({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
    });

    return {
      ok: true,
      message: messages.OK,
      status: StatusCodes.OK,
      body: kyc,
    };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      ok: false,
      message: err.message || messages.INTERNAL_SERVER_ERROR,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
}

export async function getAllKYCs() {
  try {
    const kycs = await KYCVerification.findAll({
      include: [{ model: User }],
      order: [["created_at", "DESC"]],
    });

    return {
      ok: true,
      message: messages.OK,
      status: StatusCodes.OK,
      body: kycs,
    };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      ok: false,
      message: err.message || messages.INTERNAL_SERVER_ERROR,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
}

export async function verifyKYC(kycId: string) {
  try {
    const kyc = await KYCVerification.findByPk(kycId);
    if (!kyc) throw new Error("KYC record not found");

    if (kyc.document_front_url) await deleteFile(kyc.document_front_url);
    if (kyc.document_back_url) await deleteFile(kyc.document_back_url);

    kyc.document_front_url = "";
    kyc.document_back_url = "";

    kyc.status = "verified";
    kyc.verified_at = new Date();
    kyc.rejection_reason = undefined;
    await kyc.save();

    return {
      ok: true,
      message: messages.OK,
      status: StatusCodes.OK,
      body: kyc,
    };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      ok: false,
      message: err.message || messages.INTERNAL_SERVER_ERROR,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
}

export async function rejectKYC(kycId: string, reason: string) {
  try {
    const kyc = await KYCVerification.findByPk(kycId);
    if (!kyc) throw new Error("KYC record not found");

    kyc.status = "rejected";
    kyc.rejection_reason = reason;
    await kyc.save();

    return {
      ok: true,
      message: messages.OK,
      status: StatusCodes.OK,
      body: kyc,
    };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      ok: false,
      message: err.message || messages.INTERNAL_SERVER_ERROR,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
}

export async function deleteKYC(kycId: string) {
  try {
    const record = await KYCVerification.findByPk(kycId);
    if (!record)
      return {
        ok: false,
        message: messages.NOT_FOUND,
        status: StatusCodes.NOT_FOUND,
        body: null,
      };

    if (record.document_front_url) await deleteFile(record.document_front_url);
    if (record.document_back_url) await deleteFile(record.document_back_url);

    await record.destroy();

    return {
      ok: true,
      message: messages.OK,
      status: StatusCodes.OK,
      body: null,
    };
  } catch (error: unknown) {
    const err = error as Error;
    return {
      ok: false,
      message: err.message || messages.INTERNAL_SERVER_ERROR,
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
}
