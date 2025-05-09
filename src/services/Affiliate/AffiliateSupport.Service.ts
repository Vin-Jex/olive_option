import { SupportMessage } from "../../models/Affiliate/AffiliateSupport.Model";
import { ServiceResponse } from "../../types/Affiliate/Affiliate.types";
import { StatusCodes } from "http-status-codes";
import { sendEmail } from "../../utils/Affiliate/emailService";
import { isSequelizeValidationError } from "../../utils/validations/AffiliateErrorFunction";
import { messages } from "../../utils/consts";

/**
 * Submit a support message from a user.
 * @param {string} email - The email address of the user.
 * @param {string} message - The message content sent by the user.
 * @returns {Promise<ServiceResponse<{ acknowledgment: string }>>} - A promise that resolves to a service response containing
 * the status of the operation and an acknowledgment message if successful.
 */
export const SubmitSupportMessageService = async (
  email: string,
  message: string,
  userName: string,
  tokens?: { accessToken?: string; refreshToken?: string }
): Promise<ServiceResponse<{ acknowledgment: string }>> => {
  try {
    // Validate inputs
    if (!email || !message) {
      return {
        ok: false,
        message: "Email and message are required.",
        statusCode: StatusCodes.BAD_REQUEST,
        body: null,
        tokens,
      };
    }

    // Simulate storing the support message in the database
    await SupportMessage.create({
      email,
      message,
      status: "received",
      createdAt: new Date(),
    });

    await sendEmail(email, userName);

    return {
      ok: true,
      message: "Support message received.",
      statusCode: StatusCodes.OK,
      body: {
        acknowledgment:
          "Thank you for reaching out! Our customer support team will get back to you shortly.",
      },
      tokens,
    };
  } catch (error) {
    if (isSequelizeValidationError(error)) {
      // Sequelize validation error
      if (error.name === "SequelizeValidationError") {
        return {
          ok: false,
          message: error.errors.map((err: any) => err.message),
          statusCode: StatusCodes.BAD_REQUEST,
          body: null,
          tokens,
        };
      }
    }

    // Other Error
    return {
      ok: false,
      message: messages.INTERNAL_SERVER_ERROR,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: null,
      tokens,
    };
  }
};
