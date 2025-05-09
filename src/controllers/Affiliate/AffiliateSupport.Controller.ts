import { Response } from "express";
import { CustomRequest } from "./Affiliate.Controller";
import { SubmitSupportMessageService } from "../../services/Affiliate/AffiliateSupport.Service";

/**
 * Handle the submission of a support message.
 * @param {Request} req - The HTTP request object.
 * @param {Response} res - The HTTP response object.
 */
export const SubmitSupportMessageController = async (
  req: CustomRequest,
  res: Response
) => {
  const { email, message } = req.body;
  const { accessToken, refreshToken, user } = req;

  const serviceResponse = await SubmitSupportMessageService(
    email,
    message,
    user?.full_name!,
    { accessToken, refreshToken }
  );

  if (serviceResponse.ok) {
    return res.status(serviceResponse.statusCode).json(serviceResponse);
  }

  return res.status(serviceResponse.statusCode).json(serviceResponse);
};
