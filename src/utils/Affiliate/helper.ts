import bcrypt from "bcryptjs";
import crypto from "crypto";
/**
 * Hashes a plain text password using bcrypt.
 * @param {string} password - The plain text password.
 * @returns {Promise<string>} - The hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

/**
 * Compares a plain text password with its hashed version.
 * @param {string} password - The plain text password.
 * @param {string} hash - The hashed password.
 * @returns {Promise<boolean>} - True if the password matches, false otherwise.
 */
export const comparePasswords = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate a four-digit unique code.
 * @returns {string} - A four-digit unique code.
 */
export const generateUniqueCode = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

/**
 * Generates a random OTP (One-Time Password).
 * @returns {string} - The generated OTP.
 */
export const generateOtp = (): string => {
  const otp = crypto.randomInt(1000, 9999);
  return otp.toString();
};

/**
 * Generates a verification code for email verification.
 * @returns {string} - The verification code.
 */
export const generateVerificationCode = (): string => {
  // Generates a 40-character hex string
  return crypto.randomBytes(20).toString("hex");
};

import useragent from "useragent";
import { LocationInfo, TMetaData } from "../../types/Affiliate/Affiliate.types";

// Helper to get metadata from user agent and IP
export const generateClickMetadata = async (
  userAgent: string,
  ipAddress: string
): Promise<TMetaData> => {
  const agent = useragent.parse(userAgent);

  const deviceInfo = {
    device: agent.device.toString(),
    os: agent.os.toString(),
    browser: agent.toAgent(),
  };

  let locationInfo: LocationInfo | null = null;
  try {
    const response = await fetch(`http://ip-api.com/json/${ipAddress}`);
    if (response.ok) {
      locationInfo = await response.json();
    }
  } catch (error) {
    console.error("Failed to fetch location info:", error);
  }

  return {
    device: deviceInfo,
    location: {
      country: locationInfo?.country,
      region: locationInfo?.region,
      city: locationInfo?.city,
      ip: ipAddress,
    },
    engagement: {
      timestamp: new Date().toISOString(),
      userAgent,
    },
  };
};

export const isSequelizeValidationError = (error: any): boolean =>
  error.name === "SequelizeValidationError";

export const isSequelizeUniqueConstraintError = (error: any): boolean =>
  error.name === "SequelizeUniqueConstraintError";

export const isSequelizeDatabaseError = (error: any): boolean =>
  error.name === "SequelizeDatabaseError";
