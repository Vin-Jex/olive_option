import { createTransport } from 'nodemailer';
import env from './config';

const isProduction = env.NODE_ENV === "production";

export const mailer = createTransport({
  host: env.SMTP_HOST,
  port: isProduction ? Number(env.SMTP_PORT) : env.SMTP_PORT_LOCAL,
  secure: isProduction ? false : true,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
  ...(isProduction ? {} : { debug: true, logger: true }),
});
