import { Router } from "express";
// import { sumsubWebhook } from "../hooks/sumsub.hook";

const SumSubWebhookRouter = Router();

// SumSubWebhookRouter.post(
//   "/sumsub",
//   sumsubWebhook
//   /*
//     #swagger.tags = ['KYC Webhooks']
//     #swagger.description = "Webhook endpoint for handling SumSub applicant status updates."
//     #swagger.parameters['body'] = {
//       in: 'body',
//       required: true,
//       schema: {
//         $ref: '#/definitions/SumSubWebhookPayload'
//       }
//     }
//     #swagger.responses[200] = {
//       description: "KYC status updated successfully",
//       schema: {
//         ok: true,
//         message: "KYC status updated successfully"
//       }
//     }
//     #swagger.responses[400] = {
//       description: "Invalid event type",
//       schema: {
//         ok: false,
//         message: "Invalid event type"
//       }
//     }
//     #swagger.responses[404] = {
//       description: "KYC record not found",
//       schema: {
//         ok: false,
//         message: "KYC record not found"
//       }
//     }
//     #swagger.responses[500] = {
//       description: "Internal Server Error",
//       schema: {
//         ok: false,
//         message: "Server error"
//       }
//     }
//   */
// );

export default SumSubWebhookRouter;
