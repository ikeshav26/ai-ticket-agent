import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const sendMail = async (
    to: string,
    subject: string,
    text: string,
): Promise<SMTPTransport.SentMessageInfo | void> => {
    try {
        // Create a transporter object using SMTP
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_SMTP_HOST,
            port: Number(process.env.MAILTRAP_SMTP_PORT),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAILTRAP_SMTP_USER, // generated ethereal user
                pass: process.env.MAILTRAP_SMTP_PASSWORD,
            },
        });

        const info = await transporter.sendMail({
            from: "Mannu <no-reply@ticketingsystem.com>", // sender address
            to,
            subject,
            text,
        });
        console.log("Email sent successfully");
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
    }
};
