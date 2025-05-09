import nodemailer from "nodemailer";
import { messages } from "../consts";
import { mailer } from "../../config/mail";

// Email template for KYC approval
const kycEmailHtml = ({
  userName,
  status,
  rejectionReason,
}: {
  userName: string;
  status: "verified" | "rejected" | "pending";
  rejectionReason?: string;
}) => {
  const statusConfig = {
    verified: {
      color: "#4CAF50",
      title: `Congratulations, ${userName}!`,
      message:
        "Your KYC verification has been successfully approved. You now have full access to our platform.",
    },
    rejected: {
      color: "#D32F2F",
      title: `Hello, ${userName}`,
      message: `We regret to inform you that your KYC verification was rejected.${
        rejectionReason ? ` Reason: ${rejectionReason}` : ""
      }`,
    },
    pending: {
      color: "#FFA726",
      title: `Thank you, ${userName}!`,
      message:
        "Your KYC verification has been submitted and is currently under review. We will notify you once it's processed.",
    },
  }[status];

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>KYC Status Update</title>
    <style>
      body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f7; color: #333333; margin: 0; padding: 0; }
      .email-container { background-color: #ffffff; margin: 0 auto; padding: 20px; max-width: 600px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
      .header { background-color: ${statusConfig.color}; padding: 20px; border-top-left-radius: 8px; border-top-right-radius: 8px; text-align: center; color: #ffffff; }
      .header h1 { margin: 0; font-size: 24px; }
      .content { padding: 30px; text-align: center; }
      .content h2 { font-size: 22px; margin-bottom: 20px; }
      .message { font-size: 16px; color: #555555; line-height: 1.5; margin-bottom: 30px; }
      .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #888888; }
      .footer p { margin: 5px 0; }
      a { color: ${statusConfig.color}; text-decoration: none; }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h1>OliveOption</h1>
      </div>
      <div class="content">
        <h2>${statusConfig.title}</h2>
        <p class="message">${statusConfig.message}</p>
      </div>
      <div class="footer">
        <p>&copy; 2024 OliveOption. All rights reserved.</p>
        <p><a href="https://oliveoption.com">Visit our website</a></p>
      </div>
    </div>
  </body>
  </html>
  `;
};


// Function to send KYC email
export const sendKycEmail = async ({
  email,
  userName,
  status,
  rejectionReason,
}: {
  email: string;
  userName: string;
  status: "verified" | "rejected" | "pending";
  rejectionReason?: string;
}) => {
  try {
    const subjectMap = {
      verified: "KYC Verification Successful",
      rejected: "KYC Verification Rejected",
      pending: "KYC Verification Submitted",
    };

    await mailer.sendMail({
      from: `"${process.env.SMTP_SENDER_NAME}" <${process.env.SMTP_SENDER}>`,
      to: email,
      subject: subjectMap[status],
      html: kycEmailHtml({ userName, status, rejectionReason }),
    });
  } catch (err) {
    console.error("Failed to send KYC email:", err);
  }
};


/**
 * Sends an OTP email to the provided recipient.
 * @param {string} recipientEmail - The recipient's email address.
 * @param {string} otp - The OTP code to send.
 * @return {Promise<void>} - A promise that resolves when the email has been sent.
 */
export const sendOtpEmail = async (
  recipientEmail: string,
  otp: string
): Promise<void> => {
  try {
    // Email HTML template
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Your OTP Code</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f7; color: #333333; margin: 0; padding: 0; }
          .email-container { background-color: #ffffff; margin: 0 auto; padding: 20px; max-width: 600px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
          .header { background-color: #4CAF50; padding: 20px; border-top-left-radius: 8px; border-top-right-radius: 8px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 30px; text-align: center; }
          .content h2 { font-size: 22px; margin-bottom: 20px; }
          .otp-code { background-color: #f9f9f9; border: 1px dashed #4CAF50; color: #333333; font-size: 24px; padding: 15px; display: inline-block; letter-spacing: 5px; margin-bottom: 30px; border-radius: 8px; }
          .message { font-size: 16px; color: #555555; line-height: 1.5; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #888888; }
          .footer p { margin: 5px 0; }
          a { color: #4CAF50; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>OliveOption</h1>
          </div>
          <div class="content">
            <h2>Here is Your OTP Code</h2>
            <p class="message">Use the following One-Time Password (OTP) to proceed with your request. The OTP is valid for the next 1 minute.</p>
            <div class="otp-code">${otp}</div>
            <p class="message">If you didn't request this code, please ignore this email or contact our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 OliveOption. All rights reserved.</p>
            <p><a href="https://oliveoption.com">Visit our website</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Email options
    const mailOptions = {
      from: `"${process.env.SMTP_SENDER_NAME}" <${process.env.SMTP_SENDER}>`,
      to: recipientEmail,
      subject: "Your OTP Code",
      html: htmlTemplate,
    };

    // Send email
    await mailer.sendMail(mailOptions);

    console.log(`OTP email sent to ${recipientEmail}`);
  } catch (error) {
    console.error(messages.EMAIL_SEND_FAILURE, error);
  }
};

/**
 * Sends a verification email to the provided recipient.
 * @param {string} recipientEmail - The recipient's email address.
 * @param {string} otp - The OTP code to send.
 * @return {Promise<void>} - A promise that resolves when the email has been sent.
 */
export const sendVerificationEmail = async (
  recipientEmail: string,
  otp: string
): Promise<void> => {
  try {
    // Email HTML template
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Your OTP Code</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f7; color: #333333; margin: 0; padding: 0; }
          .email-container { background-color: #ffffff; margin: 0 auto; padding: 20px; max-width: 600px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
          .header { background-color: #4CAF50; padding: 20px; border-top-left-radius: 8px; border-top-right-radius: 8px; text-align: center; color: #ffffff; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 30px; text-align: center; }
          .content h2 { font-size: 22px; margin-bottom: 20px; }
          .otp-code { background-color: #f9f9f9; border: 1px dashed #4CAF50; color: #333333; font-size: 24px; padding: 15px; display: inline-block; letter-spacing: 5px; margin-bottom: 30px; border-radius: 8px; }
          .message { font-size: 16px; color: #555555; line-height: 1.5; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #888888; }
          .footer p { margin: 5px 0; }
          a { color: #4CAF50; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>OliveOption</h1>
          </div>
          <div class="content">
            <h2>Your Email Verification OTP</h2>
            <p class="message">Use the following OTP to verify your email address. This OTP is valid for 2 minutes.</p>
            <div class="otp-code">${otp}</div>
            <p class="message">If you did not request this OTP, please ignore this email or contact our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 OliveOption. All rights reserved.</p>
            <p><a href="https://oliveoption.com">Visit our website</a></p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Email options
    const mailOptions = {
      from: `"${process.env.SMTP_SENDER_NAME}" <${process.env.SMTP_SENDER}>`,
      to: recipientEmail,
      subject: "Verify Your Email Address",
      html: htmlTemplate,
    };

    // Send email
    await mailer.sendMail(mailOptions);

    console.log(`Verification email sent to ${recipientEmail}`);
  } catch (error) {
    console.error(messages.EMAIL_SEND_FAILURE, error);
  }
};

/**
 * Sends an email to the provided recipient.
 * @param {string} recipientEmail - The recipient's email address.
 * @param {string} userName - The username to send.
 * @return {Promise<void>} - A promise that resolves when the email has been sent.
 */
export const sendEmail = async (
  recipientEmail: string,
  userName: string
): Promise<void> => {
  try {
    // Email HTML template
    const htmlTemplate = `
     <!DOCTYPE html>
<html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Customer Support</title>
    <style>
      body {
        font-family: 'Helvetica Neue', Arial, sans-serif;
        background-color: #f4f4f7;
        color: #333333;
        margin: 0;
        padding: 0;
      }

      .email-container {
        background-color: #ffffff;
        margin: 0 auto;
        padding: 20px;
        max-width: 600px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .header {
        background-color: #4CAF50;
        padding: 20px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        text-align: center;
        color: #ffffff;
      }

      .header h1 {
        margin: 0;
        font-size: 24px;
      }

      .content {
        padding: 30px;
        text-align: left;
      }

      .content h2 {
        font-size: 22px;
        margin-bottom: 20px;
        text-align: center;
      }

      .message {
        font-size: 16px;
        color: #555555;
        line-height: 1.5;
        margin-bottom: 20px;
      }

      .thank-you {
        font-size: 18px;
        font-weight: bold;
        color: #333333;
        text-align: center;
        margin-top: 30px;
      }

      .footer {
        margin-top: 40px;
        text-align: center;
        font-size: 12px;
        color: #888888;
      }

      .footer p {
        margin: 5px 0;
      }

      a {
        color: #4CAF50;
        text-decoration: none;
      }
    </style>
  </head>

  <body>
    <div class="email-container">
      <div class="header">
        <h1>Customer Support</h1>
      </div>
      <div class="content">
        <h2>Thank You for Reaching Out</h2>
        <p class="message">
          Dear ${userName},
        </p>
        <p class="message">
          We have received your message sent from the email address: <strong>${recipientEmail}</strong>.
        </p>
        <p class="message">
          Our support team is reviewing your query and will get back to you as soon as possible. If this matter requires
          immediate attention, please feel free to contact us directly.
        </p>
        <p class="message">
          Thank you for your patience and for choosing our service. We are here to assist you!
        </p>
        <p class="thank-you">Sincerely, <br> The Support Team</p>
      </div>
      <div class="footer">
        <p>&copy; 2024 YourCompany. All rights reserved.</p>
        <p><a href="https://oliveoption.com">Visit our website</a></p>
      </div>
    </div>
  </body>

</html>
    `;

    // Email options
    const mailOptions = {
      from: `"${process.env.SMTP_SENDER_NAME}" <${process.env.SMTP_SENDER}>`,
      to: recipientEmail,
      subject: "We've Received Your Message – Our Team Will Reach Out Soon",
      html: htmlTemplate,
    };

    // Send email
    await mailer.sendMail(mailOptions);

    console.log(`Support email sent to ${recipientEmail}`);
  } catch (error) {
    console.error(messages.EMAIL_SEND_FAILURE, error);
  }
};
