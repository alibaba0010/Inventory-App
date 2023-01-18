console.log(process.env.EMAIL_PASS);
import { createTransport } from "nodemailer";

import asyncHandler from "express-async-handler";

export const sendEmail = asyncHandler(
  async (message, subject, sentFrom, sendTo, replyTo) => {
    const transporter = createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASS,
      },
      //  tls: { rejectUnauthorized: false}
    });
    // Option for sending email
    const options = {
      from: sentFrom,
      to: sendTo,
      replyTo: replyTo,
      subject: subject,
      html: message,
    };

    // send email function
    const sendEMails = await transporter.sendMail(options);
    if (!sendEMails) throw new Error("Unable to send email");
    console.log("send Email",sendEMails);
  }
);
