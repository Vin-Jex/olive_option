import {
  AllUsersType,
  ServiceResponse,
} from "../../types/Affiliate/Affiliate.types";
import { StatusCodes } from "http-status-codes";
import { messages } from "../../utils/consts";
import { AffiliateTelegramLink } from "../../models/Affiliate/AffiliateTelegramLinks.Model";
import { isSequelizeValidationError } from "../../utils/validations/AffiliateErrorFunction";
import { Message } from "node-telegram-bot-api";
import axios from "axios";
import { TELEGRAM_API } from "../../app";
import { validate as validateUUID } from "uuid";

/**
 * Create a new AffiliateTelegramLink.
 * Handles account linking, opt-out scenarios, and unrelated messages.
 * @param {Message} msg - Telegram message object.
 * @returns {Promise<ServiceResponse<AffiliateTelegramLink>>} - The response with the created AffiliateTelegramLink.
 */
export const CreateAffiliateTelegramLinkService = async (
  msg: Message
): Promise<
  ServiceResponse<
    | AffiliateTelegramLink
    | {
        telegramChatId: string;
        text: string;
      }
  >
> => {
  try {
    const chatId = msg?.chat?.id;
    const username = msg?.chat?.username;
    const userMessage = msg?.text?.trim().toLowerCase()!;
    const validCommands = ["/start", "link my account", "link account", "link"];
    const optOutMessages = ["/unlink", "no", "not now", "cancel"];

    if (userMessage === "/help") {
      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: `How can we assist you? For help with account linking or any other inquiries, please contact our customer service team:

**Sales & Support Team**:

- Email: [support@companyemail.com](mailto:support@companyemail.com)
- Phone: +1 (555) 123-4567
- Live Chat: [Your Website's Live Chat Link](https://www.yourwebsite.com/chat)

Our team is available 24/7 and will get back to you as soon as possible.`,
        parse_mode: "Markdown",
      });

      return {
        ok: false,
        message: "Client requested for help.",
        statusCode: StatusCodes.OK,
        body: {
          telegramChatId: chatId.toString(),
          text: `${username?.toUpperCase()} requested for help.`,
        },
      };
    }

    // Check if the user opts out of linking their account
    if (optOutMessages.includes(userMessage)) {
      const accountToUnlink = await AffiliateTelegramLink.findOne({
        where: { telegramChatId: chatId.toString() },
      });

      if (!accountToUnlink) {
        // If no existing link is found
        await axios.post(`${TELEGRAM_API}/sendMessage`, {
          chat_id: chatId,
          text: "You are not linked to any account. Nothing to unlink.",
        });

        return {
          ok: false,
          message: "No existing link found.",
          statusCode: StatusCodes.BAD_REQUEST,
          body: {
            telegramChatId: chatId.toString(),
            text: "You are not linked to any account. Nothing to unlink.",
          },
        };
      }

      // If the link exists, delete or mark it as unlinked
      await accountToUnlink.destroy();
      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: "Your account has been successfully unlinked.",
      });
      return {
        ok: false,
        message: "Account successfully unlinked.",
        statusCode: StatusCodes.OK,
        body: {
          telegramChatId: chatId.toString(),
          text: "Your account has been successfully unlinked.",
        },
      };
    }

    // Check if the user is providing a "key:"
    const isProvidingState = userMessage.startsWith("key:");
    if (isProvidingState) {
      const state = userMessage.split("key:")[1]?.trim();
      if (!state || !validateUUID(state)) {
        await axios.post(`${TELEGRAM_API}/sendMessage`, {
          chat_id: chatId,
          text: "The unique key you provided is invalid. Please ensure it is in the correct format and try again.",
        });
        return {
          ok: false,
          message: "Invalid UUID format.",
          statusCode: StatusCodes.BAD_REQUEST,
          body: null,
        };
      }

      const existingLink = await AffiliateTelegramLink.findOne({
        where: { state },
      });

      if (existingLink) {
        if (existingLink.status === "completed") {
          await axios.post(`${TELEGRAM_API}/sendMessage`, {
            chat_id: chatId,
            text: messages.TELEGRAM_LINK_ALREADY_EXISTS,
          });
          return {
            ok: false,
            message: messages.TELEGRAM_LINK_ALREADY_EXISTS,
            statusCode: StatusCodes.CONFLICT,
            body: {
              telegramChatId: chatId.toString(),
              text: messages.TELEGRAM_LINK_ALREADY_EXISTS,
            },
          };
        }

        existingLink.telegramChatId = chatId.toString();
        existingLink.telegramUsername = username!;
        existingLink.status = "completed";
        await existingLink.save();

        await axios.post(`${TELEGRAM_API}/sendMessage`, {
          chat_id: chatId,
          text: messages.TELEGRAM_LINK_CREATED,
        });

        return {
          ok: true,
          message: messages.TELEGRAM_LINK_CREATED,
          statusCode: StatusCodes.OK,
          body: existingLink,
        };
      }

      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: "The unique key you provided is invalid or has expired. Please try again with a valid key.",
      });
      return {
        ok: false,
        message: "Invalid or expired state.",
        statusCode: StatusCodes.BAD_REQUEST,
        body: null,
      };
    }

    // Check for valid commands
    if (validCommands.includes(userMessage)) {
      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: "Please provide your unique key to complete the linking process. Send it in the format `key:<your_unique_key>`.",
      });
      return {
        ok: false,
        message: "Awaiting unique key from the user.",
        statusCode: StatusCodes.ACCEPTED,
        body: null,
      };
    }

    // Fallback for unrelated messages
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: "I'm here to assist with managing your account. You can use the following commands:\n/start - Start the bot\n/link - Link your account\n/unlink - Unlink your account\n/help - Get help with the bot\n\nPlease choose one of these options to proceed or provide your unique key in the format `key:<your_unique_key>`.",
    });

    return {
      ok: false,
      message: "Fallback response for unrelated messages.",
      statusCode: StatusCodes.OK,
      body: {
        telegramChatId: chatId.toString(),
        text: "Fallback response sent to user.",
      },
    };
  } catch (error) {
    console.error("Error creating affiliate Telegram link:", error);

    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: msg?.chat?.id,
      text: "There was an error processing your request. Please try again later.",
    });

    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
};

/**
 * Retrieve all AffiliateTelegramLinks for a user by userId and userType.
 * @param {number} userId - The ID of the user (AffiliateUser, Staff, or User).
 * @param {string} userType - The type of the user ("AffiliateUser", "Staff", "User").
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @returns {Promise<ServiceResponse<AffiliateTelegramLink[]>>} - The response with the list of links.
 */
export const GetAllAffiliateTelegramLinksService = async (
  userId: number,
  userType: AllUsersType,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<AffiliateTelegramLink[]>> => {
  try {
    const affiliateTelegramLinks = await AffiliateTelegramLink.findAll({
      where: { userId, userType },
    });

    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.OK,
      body: affiliateTelegramLinks,
      tokens,
    };
  } catch (error) {
    if (isSequelizeValidationError(error)) {
      return {
        ok: false,
        message: error.errors.map((err: any) => err.message),
        statusCode: StatusCodes.BAD_REQUEST,
        body: null,
      };
    }

    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
};

/**
 * Retrieve an AffiliateTelegramLink by userId and userType.
 * @param {number} userId - The ID of the user (AffiliateUser, Staff, or User).
 * @param {string} userType - The type of the user ("AffiliateUser", "Staff", "User").
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @returns {Promise<ServiceResponse<AffiliateTelegramLink>>} - The response with the found link.
 */
export const GetAffiliateTelegramLinkByIdService = async (
  userId: number,
  userType: AllUsersType,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<AffiliateTelegramLink>> => {
  try {
    const affiliateTelegramLink = await AffiliateTelegramLink.findOne({
      where: { userId, userType },
    });

    if (!affiliateTelegramLink) {
      return {
        ok: false,
        message: messages.TELEGRAM_LINK_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
        tokens,
      };
    }

    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.OK,
      body: affiliateTelegramLink,
      tokens,
    };
  } catch (error) {
    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
};

/**
 * Update an existing AffiliateTelegramLink by userId and userType.
 * @param {number} userId - The ID of the user (AffiliateUser, Staff, or User).
 * @param {string} userType - The type of the user ("AffiliateUser", "Staff", "User").
 * @param {Partial<AffiliateTelegramLink>} updates - The updates to apply to the link.
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @returns {Promise<ServiceResponse<AffiliateTelegramLink>>} - The response with the updated link.
 */
export const UpdateAffiliateTelegramLinkService = async (
  userId: number,
  userType: AllUsersType,
  updates: Partial<AffiliateTelegramLink>,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<AffiliateTelegramLink>> => {
  try {
    const [updatedCount, updatedLinks] = await AffiliateTelegramLink.update(
      updates,
      {
        where: { userId, userType },
        returning: true,
      }
    );

    if (updatedCount === 0) {
      return {
        ok: false,
        message: messages.TELEGRAM_LINK_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
        tokens,
      };
    }

    return {
      ok: true,
      message: messages.OK,
      statusCode: StatusCodes.OK,
      body: updatedLinks[0],
      tokens,
    };
  } catch (error) {
    if (isSequelizeValidationError(error)) {
      return {
        ok: false,
        message: error.errors.map((err: any) => err.message),
        statusCode: StatusCodes.BAD_REQUEST,
        body: null,
      };
    }

    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
};

/**
 * Delete an AffiliateTelegramLink by userId and userType.
 * @param {number} userId - The ID of the user (AffiliateUser, Staff, or User).
 * @param {string} userType - The type of the user ("AffiliateUser", "Staff", "User").
 * @param {Object} [tokens] - Optional tokens for authentication.
 * @returns {Promise<ServiceResponse<void>>} - The response indicating the result of the deletion.
 */
export const DeleteAffiliateTelegramLinkService = async (
  userId: number,
  userType: AllUsersType,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<void>> => {
  try {
    const deletedCount = await AffiliateTelegramLink.destroy({
      where: { userId, userType },
    });

    if (deletedCount === 0) {
      return {
        ok: false,
        message: messages.TELEGRAM_LINK_NOT_FOUND,
        statusCode: StatusCodes.NOT_FOUND,
        body: null,
        tokens,
      };
    }

    return {
      ok: true,
      message: messages.TELEGRAM_LINK_DELETE,
      statusCode: StatusCodes.OK,
      body: null,
      tokens,
    };
  } catch (error) {
    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
    };
  }
};
