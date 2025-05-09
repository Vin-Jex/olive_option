import { Response } from "express";
import { CustomRequest } from "./Affiliate.Controller";
import { GetAffiliateDashboardService } from "../../services/Affiliate/AffiliateDashboardOverview.Service";

/**
 * Controller to fetch user clicks grouped by date.
 *
 * @param {Request} req - The request object containing the user ID.
 * @param {Response} res - The response object to send the result or an error message.
 */
export const GetDashboardOverview = async (
  req: CustomRequest,
  res: Response
) => {
  const { user, accessToken, refreshToken } = req;

  const response = await GetAffiliateDashboardService(user?.id as string, {
    accessToken,
    refreshToken,
  });

  return res.status(response.statusCode).json(response);
};
