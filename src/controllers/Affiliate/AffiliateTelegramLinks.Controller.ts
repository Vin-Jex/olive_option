import { Request, Response } from "express";
import {
  CreateAffiliateTelegramLinkService,
  GetAllAffiliateTelegramLinksService,
  GetAffiliateTelegramLinkByIdService,
  UpdateAffiliateTelegramLinkService,
  DeleteAffiliateTelegramLinkService,
} from "../../services/Affiliate/AffiliateTelegramLinks.Service";
import { CustomRequest } from "./Affiliate.Controller";
import { AllUsersType } from "../../types/Affiliate/Affiliate.types";
import { StatusCodes } from "http-status-codes";
import { Message } from "node-telegram-bot-api";
import { AffiliateTelegramLink } from "../../models/Affiliate/AffiliateTelegramLinks.Model";
import { v4 as uuidv4 } from "uuid";
import env from "../../config/config";
import { messages } from "../../utils/consts";

/**
 * Controller to create or update an Affiliate Telegram link.
 */
let lastProcessedMessageId: number | null = null;
export const CreateAffiliateTelegramLinkController = async (
  req: Request,
  res: Response
) => {
  try {
    const { message } = req.body;

    if (!message || !message.chat || !message.chat.id) {
      console.error("Invalid message object: missing chat_id.");
      return res.status(StatusCodes.BAD_REQUEST).json({
        ok: false,
        message: "Invalid Telegram message: chat_id is required.",
      });
    }

    const { message_id: messageId } = message;

    if (lastProcessedMessageId && messageId <= lastProcessedMessageId) {
      console.log("Duplicate or old message received. Ignoring.");
      return res.status(200).json({
        ok: true,
        message: "Message already processed.",
      });
    }
    lastProcessedMessageId = messageId;

    // Call the service to process the Telegram link creation or update
    const serviceResponse = await CreateAffiliateTelegramLinkService(
      message as Message
    );

    // Return the service response to the client
    return res.status(serviceResponse.statusCode).json(serviceResponse);
  } catch (error) {
    console.error("Error handling Telegram webhook:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ok: false,
      message: "Internal server error.",
    });
  }
};

export const InitiateAffiliateTelegramLinkController = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { userType } = req.body;
    const { user } = req;

    // Validate user ID
    if (!user?.id) {
      console.error("User ID not available. Missing authentication tokens.");
      return res.status(StatusCodes.UNAUTHORIZED).json({
        ok: false,
        message: "Authentication tokens are required to retrieve the user ID.",
      });
    }

    // Validate userType
    if (!userType) {
      console.error("User type is required but was not provided.");
      return res.status(StatusCodes.BAD_REQUEST).json({
        ok: false,
        message: "User type is required.",
      });
    }

    // Check if a pending link already exists
    const existingLink = await AffiliateTelegramLink.findOne({
      where: { userId: user.id, userType, status: "pending" },
    });

    if (existingLink) {
      return res.status(StatusCodes.CONFLICT).json({
        ok: false,
        message: "A pending link request already exists.",
        body: {
          deepLink: `${env.BOT_URL}?start=${existingLink.state}`,
        },
      });
    }

    // Create a new "pending" link entry
    const uniqueState = uuidv4();
    const response = await AffiliateTelegramLink.create({
      userId: user.id,
      userType,
      state: uniqueState,
      status: "pending",
    });

    // Generate a deep link for the frontend
    const deepLink = `${env.BOT_URL}`;

    return res.status(StatusCodes.CREATED).json({
      ok: true,
      status: StatusCodes.CREATED,
      message: messages.TELEGRAM_LINK_CREATION_IN_PROGRESS,
      // "Linking process initiated. Provide this link to the user.",
      body: {
        userId: response.id,
        userType: response.userType,
        state: response.state,
        status: response.status,
        url: deepLink,
      },
    });
  } catch (error) {
    console.error("Error initiating Telegram link creation:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ok: false,
      message: "Internal server error.",
    });
  }
};

/**
 * Controller to retrieve all Affiliate Telegram links for a user.
 */
export const GetAllAffiliateTelegramLinksController = async (
  req: CustomRequest,
  res: Response
) => {
  const { userType } = req.query;
  const { accessToken, refreshToken, user } = req;

  const serviceResponse = await GetAllAffiliateTelegramLinksService(
    Number(user?.id!),
    userType as AllUsersType,
    { accessToken, refreshToken }
  );

  return res.status(serviceResponse.statusCode).json(serviceResponse);
};

/**
 * Controller to retrieve an Affiliate Telegram link by user ID and user type.
 */
export const GetAffiliateTelegramLinkByIdController = async (
  req: CustomRequest,
  res: Response
) => {
  const { userType } = req.params;
  const { accessToken, refreshToken, user } = req;

  const serviceResponse = await GetAffiliateTelegramLinkByIdService(
    Number(user?.id!),
    userType as AllUsersType,
    { accessToken, refreshToken }
  );

  return res.status(serviceResponse.statusCode).json(serviceResponse);
};

/**
 * Controller to update an existing Affiliate Telegram link.
 */
export const UpdateAffiliateTelegramLinkController = async (
  req: CustomRequest,
  res: Response
) => {
  const { userType } = req.params;
  const updates = req.body;
  const { accessToken, refreshToken, user } = req;

  const serviceResponse = await UpdateAffiliateTelegramLinkService(
    Number(user?.id!),
    userType as AllUsersType,
    updates,
    { accessToken, refreshToken }
  );

  return res.status(serviceResponse.statusCode).json(serviceResponse);
};

/**
 * Controller to delete an Affiliate Telegram link by user ID and user type.
 */
export const DeleteAffiliateTelegramLinkController = async (
  req: CustomRequest,
  res: Response
) => {
  const { userType } = req.params;
  const { accessToken, refreshToken, user } = req;

  const serviceResponse = await DeleteAffiliateTelegramLinkService(
    Number(user?.id!),
    userType as AllUsersType,
    { accessToken, refreshToken }
  );

  return res.status(serviceResponse.statusCode).json(serviceResponse);
};
