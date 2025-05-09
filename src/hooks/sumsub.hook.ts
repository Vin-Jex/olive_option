// import { Request, Response } from "express";
// import { KYCVerification } from "../models/KYCVerification.Model";
// import { StatusCodes } from "http-status-codes";
// import { User } from "../models/User";
// import { sendKycEmail } from "../utils/Affiliate/emailService";
// import { verifyKYC } from "../services/KYCVerification.Services";

// export const sumsubWebhook = async (req: Request, res: Response) => {
//   try {
//     const { event, payload } = req.body;

//     if (event === "applicant.statusChanged") {
//       const { applicantId, status, reason } = payload;

//       const kycRecord = await KYCVerification.findOne({
//         where: { user_id: applicantId },
//         include: [User],
//       });

//       if (!kycRecord) {
//         return res.status(StatusCodes.NOT_FOUND).json({
//           ok: false,
//           message: "KYC record not found",
//           status: StatusCodes.NOT_FOUND,
//         });
//       }

//       const user = kycRecord.user;

//       if (status === "verified") {
//         const result = await verifyKYC(kycRecord.id);

//         if (user?.email) {
//           await sendKycEmail({
//             email: user.email,
//             userName: user.first_name || "",
//             status: "verified",
//           });
//         }

//         return res.status(result.status).json(result);
//       }

//       kycRecord.status = status;
//       kycRecord.rejection_reason = reason || null;
//       await kycRecord.save();

//       if (user?.email) {
//         await sendKycEmail({
//           email: user.email,
//           userName: user.first_name || "",
//           status: status,
//           rejectionReason: reason,
//         });
//       }

//       return res.status(StatusCodes.OK).json({
//         ok: true,
//         message: "KYC status updated successfully",
//         status: StatusCodes.OK,
//       });
//     }

//     return res.status(StatusCodes.BAD_REQUEST).json({
//       ok: false,
//       message: "Invalid event type",
//       status: StatusCodes.BAD_REQUEST,
//     });
//   } catch (error) {
//     console.error("Webhook error:", error);
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       ok: false,
//       message: "Server error",
//       status: StatusCodes.INTERNAL_SERVER_ERROR,
//     });
//   }
// };
