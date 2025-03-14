import nodemailer from "nodemailer";
import { mailConfig } from './helperConfig.js';
import dotenv from "dotenv";

dotenv.config(); // Load environment variables


const { mailService, auth, resetLink, from } = mailConfig;

const transporter = nodemailer.createTransport({
    service: mailService,
    auth: {
      user: auth.user,
      pass: auth.pass,
    },
  });

export const sendResetEmail = async (email, token) => {
    const resetLink = `http://localhost:3000/password-reset?token=${token}`;

    const mailOptions = {
        from: "kotesharya1@gmail.com",
        to: email,
        subject: "Password Reset Request",
        text: `Click the link to reset your password: ${resetLink}`,
    };

    return transporter.sendMail(mailOptions);
};
