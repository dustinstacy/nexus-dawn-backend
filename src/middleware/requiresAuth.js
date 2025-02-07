import jwt from "jsonwebtoken"
import User from "../models/User.js"

const requiresAuth = async (req, res, next) => {
    try {
        let token

        const tokenParts = req.headers.authorization?.split(" ")
        if (tokenParts[0] === "Bearer" && tokenParts[1]) {
            token = tokenParts[1]
        }

        if (!token) {
            return res.status(401).json({ error: "No token provided, authorization denied." })
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Get user information from the decoded token
        req.user = await User.findById(decoded.userId).select("-password")

        next()
    } catch (err) {
        console.log(err)
        res.status(401).json({ message: "Token is not valid" })
    }
}

export default requiresAuth
