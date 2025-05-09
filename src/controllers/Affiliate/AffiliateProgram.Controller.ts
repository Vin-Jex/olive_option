import { Response } from "express";
import {
  CreateAffiliateProgramService,
  DeleteAffiliateProgramService,
  GetAllAffiliateProgramsService,
  GetAffiliateProgramByIdService,
  UpdateAffiliateProgramService,
  ValidateAffiliateProgramService,
} from "../../services/Affiliate/AffiliateProgram.Service";
import { CustomRequest } from "./Affiliate.Controller";
import { StatusCodes } from "http-status-codes";
import { messages } from "../../utils/consts";

/**
 * Controller to create a new Affiliate program
 *
 * @param {CustomRequest} req - The request object containing the Affiliate program details in the body.
 * @param {Response} res - The response object that will contain the created Affiliate program or an error message.
 */
export const createAffiliateProgram = async (req: CustomRequest, res: Response) => {
  const { accessToken, refreshToken } = req;
  const { name } = req.body;

  try {
    const response = await CreateAffiliateProgramService(name, {
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
 * Controller to update a Affiliate program by its ID
 *
 * @param {CustomRequest} req - The request object with the Affiliate program ID in the path and update data in the body.
 * @param {Response} res - The response object with the updated Affiliate program or an error message.
 */
export const updateAffiliateProgram = async (req: CustomRequest, res: Response) => {
  const { accessToken, refreshToken } = req;
  const { id } = req.params;
  const updates = req.body;

  try {
    const response = await UpdateAffiliateProgramService(id, updates, {
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
 * Controller to delete a Affiliate program by its ID
 *
 * @param {CustomRequest} req - The request object with the Affiliate program ID in the path.
 * @param {Response} res - The response object indicating if the Affiliate program was successfully deleted or not.
 */
export const deleteAffiliateProgram = async (req: CustomRequest, res: Response) => {
  const { accessToken, refreshToken } = req;
  const { id } = req.params;

  try {
    const response = await DeleteAffiliateProgramService(id, {
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
 * Controller to get a Affiliate program by its ID
 *
 * @param {CustomRequest} req - The request object with the Affiliate program ID in the path.
 * @param {Response} res - The response object with the Affiliate program data or an error message.
 */
export const getAffiliateProgramById = async (req: CustomRequest, res: Response) => {
  const { accessToken, refreshToken } = req;
  const { id } = req.params;

  try {
    const response = await GetAffiliateProgramByIdService(id, {
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
 * Controller to get all Affiliate programs
 *
 * @param {CustomRequest} req - The request object.
 * @param {Response} res - The response object containing all Affiliate programs or an error message.
 */
export const getAllAffiliatePrograms = async (req: CustomRequest, res: Response) => {
  const { accessToken, refreshToken } = req;

  try {
    const response = await GetAllAffiliateProgramsService({
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
 * Controller to validate a Affiliate program by its name
 *
 * @param {CustomRequest} req - The request object containing the Affiliate program name in the body.
 * @param {Response} res - The response object indicating if the Affiliate program is valid or not.
 */
export const validateAffiliateProgram = async (req: CustomRequest, res: Response) => {
  const { name } = req.body;
  const { accessToken, refreshToken } = req;

  try {
    const response = await ValidateAffiliateProgramService(name, {
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
