import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"
import requiresAuth from "../middleware/requiresAuth.js"
import { hasUser } from "../utils/hasUser.js"
import {
    validateRegisterInput,
    checkForExistingEmail,
    checkForExistingUsername,
} from "../middleware/registerValidation.js"
import { generateResetToken } from "../utils/generateResetToken.js"
import { sendResetEmail } from "../utils/emailService.js"

const router = express.Router()

// @route GET /api/auth/test
// @desc Test the Auth route
// @access Public
router.get("/test", (req, res) => {
    res.send("Auth route working")
})

// @route POST /api/auth/register
// @desc Create a new user
// @access Public
router.post("/register", checkForExistingEmail, checkForExistingUsername, async (req, res, next) => {
    try {
        const { errors, isValid } = validateRegisterInput(req.body)

        if (!isValid) {
            return res.status(400).json(errors)
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 12)

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        })

        const savedUser = await newUser.save()
        const payload = { userId: savedUser._id }
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
        })

        const userToReturn = savedUser.toJSON()
        delete userToReturn.password
        res.json({
            accessToken: accessToken,
            user: userToReturn,
        })
    } catch (error) {
        next(error)
    }
})

// @route POST /api/auth/login
// @desc Login user and return an access token
// @access Public
router.post("/login", async (req, res, next) => {
    try {
        const user = await User.findOne({
            username: new RegExp("^" + req.body.username + "$", "i"),
        })

        if (!user) {
            return res.status(400).json({ error: "Invalid login credentials" })
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.password)
        if (!passwordMatch) {
            return res.status(400).json({ error: "Invalid login credentials" })
        }

        const payload = { userId: user._id }
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
        })

        const userToReturn = user.toJSON()
        delete userToReturn.password
        res.json({
            accessToken: accessToken,
            user: userToReturn,
        })
    } catch (error) {
        next(error)
    }
})

// @route Get /api/auth/current
// @desc Return currently authed user
// @access Private
router.get("/current", requiresAuth, (req, res, next) => {
    try {
        if (!hasUser(req)) {
            return res.status(400).json({ error: "No user found" })
        }
        res.json(req.user)
    } catch (err) {
        next(err)
    }
})

// @route Put /api/auth/logout
// @desc Logout user and clear the cookie
// @access Private
router.put("/logout", requiresAuth, async (req, res, next) => {
    try {
        res.cookie("access-token", "", { expires: new Date(0) })
        res.json({ success: true, message: "Logged out successfully" })
    } catch (err) {
        next(err)
    }
})

router.post("/reset-password", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) return res.status(400).json({ email: "Email is required" });

        // Check if user exists in database
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ email: "No account with this email" });

        // Generate reset token (store in DB or send directly)
        const resetToken = generateResetToken();
        await sendResetEmail(email, resetToken);

        res.json({ message: "Password Reset link sent to the registered email." });
    } catch (error) {
        console.error("Error in reset-password route:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
export default router
