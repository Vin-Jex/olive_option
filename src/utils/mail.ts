import { mailer } from '../config/mail';

export const sendMail = async (details: { to: Array<string>, subject: string, text: string, html: string }) => {
    let { to, subject, text, html } = details;
    let readyTo = to.join(', ');
    const send = await mailer.sendMail({
        from: `"${process.env.SMTP_SENDER_NAME}" <${process.env.SMTP_SENDER}>`,
        to : readyTo,
        subject,
        text,
        html
    });

    try {
        return send.messageId;
    } catch (error) {
        throw error;
    }
}