import { Response } from "express";
import { CreatePromoCodeService, DeletePromoCodeService, GetAllPromoCodesService, GetPromoCodeByIdService, UpdatePromoCodeService, ValidatePromoCodeService } from "../../services/Affiliate/PromoCode.Service";
import { CustomRequest } from "./Affiliate.Controller";
import { StatusCodes } from "http-status-codes";
import { messages } from "../../utils/consts";


/**
 * Controller to create a new promo code
 *
 * @param {CustomRequest} req - The request object containing the promo code details in the body.
 * @param {Response} res - The response object that will contain the created promo code or an error message.
 */
export const createPromoCode = async (req: CustomRequest, res: Response) => {
  const { accessToken, refreshToken } = req;
  const { code, ...otherData } = req.body;

  try {
    const response = await CreatePromoCodeService(code, otherData, {
      accessToken,
      refreshToken,
    });
     return res.status(response.statusCode).json(response);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      body: null,
    });
  }
};

/**
 * Controller to update a promo code by its ID
 *
 * @param {CustomRequest} req - The request object with the promo code ID in the path and update data in the body.
 * @param {Response} res - The response object with the updated promo code or an error message.
 */
export const updatePromoCode = async (req: CustomRequest, res: Response) => {
  const { accessToken, refreshToken } = req;
  const { id } = req.params;
  const updates = req.body;

  try {
    const response = await UpdatePromoCodeService(id, updates, {
      accessToken,
      refreshToken,
    });
    return res.status(response.statusCode).json(response);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      body: null,
    });
  }
};

/**
 * Controller to delete a promo code by its ID
 *
 * @param {CustomRequest} req - The request object with the promo code ID in the path.
 * @param {Response} res - The response object indicating if the promo code was successfully deleted or not.
 */
export const deletePromoCode = async (req: CustomRequest, res: Response) => {
  const { accessToken, refreshToken } = req;
  const { id } = req.params;

  try {
    const response = await DeletePromoCodeService(id, {
      accessToken,
      refreshToken,
    });
    return res.status(response.statusCode).json(response);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      body: null,
    });
  }
};

/**
 * Controller to get a promo code by its ID
 *
 * @param {CustomRequest} req - The request object with the promo code ID in the path.
 * @param {Response} res - The response object with the promo code data or an error message.
 */
export const getPromoCodeById = async (req: CustomRequest, res: Response) => {
  const { accessToken, refreshToken } = req;
  const { id } = req.params;

  try {
    const response = await GetPromoCodeByIdService(id, {
      accessToken,
      refreshToken,
    });
    return res.status(response.statusCode).json(response);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      body: null,
    });
  }
};

/**
 * Controller to get all promo codes
 *
 * @param {CustomRequest} req - The request object.
 * @param {Response} res - The response object containing all promo codes or an error message.
 */
export const getAllPromoCodes = async (req: CustomRequest, res: Response) => {
  const { accessToken, refreshToken } = req;

  try {
    const response = await GetAllPromoCodesService({
      accessToken,
      refreshToken,
    });
    return res.status(response.statusCode).json(response);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      body: null,
    });
  }
};

/**
 * Controller to validate a promo code
 *
 * @param {CustomRequest} req - The request object containing the promo code to validate in the body.
 * @param {Response} res - The response object indicating if the promo code is valid or not.
 */
export const validatePromoCode = async (req: CustomRequest, res: Response) => {
  const { accessToken, refreshToken } = req;
  const { code } = req.body;

  try {
    const response = await ValidatePromoCodeService(code, {
      accessToken,
      refreshToken,
    });
    return res.status(response.statusCode).json(response);
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      body: null,
    });
  }
};
