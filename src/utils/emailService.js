import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables
const transporter = nodemailer.createTransport({
    service: "Gmail", // Use "SendGrid" or other if preferred
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendResetEmail = async (email, token) => {
    const resetLink = `https://localhost:3000/reset-password?token=${token}`;
    
    const mailOptions = {
        from: "kotesharya1@gmail.com",
        to: email,
        subject: "Password Reset Request",
        text: `Click the link to reset your password: ${resetLink}`,
    };

    return transporter.sendMail(mailOptions);
};
