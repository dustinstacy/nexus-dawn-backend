import jwt from "jsonwebtoken";

export const generateResetToken = (userId) => {
    return jwt.sign(
        { userId }, // Store only the user ID
        process.env.JWT_SECRET, // Secure secret key
        { expiresIn: "15m" } // Expiry of 15 minutes
    );
};
