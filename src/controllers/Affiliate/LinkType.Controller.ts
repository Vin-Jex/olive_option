import { Response } from "express";
import {
  CreateLinkTypeService,
  DeleteLinkTypeService,
  GetAllLinkTypesService,
  GetLinkTypeByIdService,
  UpdateLinkTypeService,
  ValidateLinkTypeService,
} from "../../services/Affiliate/LinkType.Service";
import { CustomRequest } from "./Affiliate.Controller";
import { StatusCodes } from "http-status-codes";
import { messages } from "../../utils/consts";

/**
 * Controller to create a new link type
 *
 * @param {CustomRequest} req - The request object containing the link type details in the body.
 * @param {Response} res - The response object that will contain the created link type or an error message.
 */
export const createLinkType = async (req: CustomRequest, res: Response) => {
  const { accessToken, refreshToken, user } = req;
  const { name, url } = req.body;

  try {
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        ok: false,
        message: messages.UNAUTHORIZED,
        body: null,
      });
    }

    const response = await CreateLinkTypeService(name, url, user.id, {
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
 * Controller to update a link type by its ID
 *
 * @param {CustomRequest} req - The request object with the link type ID in the path and update data in the body.
 * @param {Response} res - The response object with the updated link type or an error message.
 */
export const updateLinkType = async (req: CustomRequest, res: Response) => {
  const { accessToken, refreshToken, user } = req;
  const { id } = req.params;
  const updates = req.body;

  try {
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        ok: false,
        message: messages.UNAUTHORIZED,
        body: null,
      });
    }
    const response = await UpdateLinkTypeService(id, updates, user.id, {
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
 * Controller to delete a link type by its ID
 *
 * @param {CustomRequest} req - The request object with the link type ID in the path.
 * @param {Response} res - The response object indicating if the link type was successfully deleted or not.
 */
export const deleteLinkType = async (req: CustomRequest, res: Response) => {
  const { accessToken, refreshToken, user } = req;
  const { id } = req.params;

  try {
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        ok: false,
        message: messages.UNAUTHORIZED,
        body: null,
      });
    }
    const response = await DeleteLinkTypeService(id, user.id, {
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
 * Controller to get a link type by its ID
 *
 * @param {CustomRequest} req - The request object with the link type ID in the path.
 * @param {Response} res - The response object with the link type data or an error message.
 */
export const getLinkTypeById = async (req: CustomRequest, res: Response) => {
  const { accessToken, refreshToken, user } = req;
  const { id } = req.params;

  try {
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        ok: false,
        message: messages.UNAUTHORIZED,
        body: null,
      });
    }

    const response = await GetLinkTypeByIdService(id, user.id, {
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
 * Controller to get all link types
 *
 * @param {CustomRequest} req - The request object.
 * @param {Response} res - The response object containing all link types or an error message.
 */
export const getAllLinkTypes = async (req: CustomRequest, res: Response) => {
  const { accessToken, refreshToken, user } = req;

  try {
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        ok: false,
        message: messages.UNAUTHORIZED,
        body: null,
      });
    }

    const response = await GetAllLinkTypesService(user.id, {
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
 * Controller to validate a link type by its name
 *
 * @param {CustomRequest} req - The request object containing the link type name in the body.
 * @param {Response} res - The response object indicating if the link type is valid or not.
 */
export const validateLinkType = async (req: CustomRequest, res: Response) => {
  const { name } = req.body;
  const { accessToken, refreshToken, user } = req;

  try {
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        ok: false,
        message: messages.UNAUTHORIZED,
        body: null,
      });
    }

    const response = await ValidateLinkTypeService(name, user.id, {
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
