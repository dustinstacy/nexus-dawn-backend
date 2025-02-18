import jwt from "jsonwebtoken"
import User from "../models/User.js"

// Middleware to check if the user is authenticated
const requiresAuth = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
        return res.status(401).send("Unauthorized")
    }

    let isAuthed = false

    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET environment variable is not set.")
        }

        const { userId } = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(userId)

        if (user) {
            const userToReturn = { ...user.toJSON() }
            delete userToReturn.password
            req.user = userToReturn
            isAuthed = true
        }
    } catch (error) {
        console.error("Error verifying token:", error)
        isAuthed = false
    }

    if (!isAuthed) {
        return res.status(401).send("Unauthorized")
    }

    return next()
}

export default requiresAuth
