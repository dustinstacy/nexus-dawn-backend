import dotenv from "dotenv";
dotenv.config();

// Set default protected mongo uri for development branch
export const MONGO_DEV_URI =
    "mongodb+srv://devUser:G18RZwiLyKVmt3rV@development-data.e0khqcy.mongodb.net/?retryWrites=true&w=majority&appName=Development-Data"

// Set default local host port
export const PORT = 5000

// Set default local client port
export const CLIENT_PORT = 3000

export const mailConfig = {
    mailService: process.env.MAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    from: process.env.MAIL_FROM,
};