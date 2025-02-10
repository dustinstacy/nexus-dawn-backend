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
} from "../middleware/reigsterValidation.js"

const router = express.Router()

// Generate and set the access token cookie
const setAccessTokenCookie = (res, token) => {
    const expirationTime = new Date(Date.now() + 3600000)
    res.cookie("access-token", token, {
        expires: expirationTime,
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "Strict",
    })
}

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
        const token = jwt.sign(payload, process.env.JWT_SECRET)
        setAccessTokenCookie(res, token)

        const userToReturn = savedUser.toJSON()
        delete userToReturn.password
        res.json({
            token: token,
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
        const token = jwt.sign(payload, process.env.JWT_SECRET)

        setAccessTokenCookie(res, token)

        const userToReturn = user.toJSON()
        delete userToReturn.password
        res.json({
            token: token,
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
        res.clearCookie("access-token")
        res.clearCookie("token")
        res.json({ success: true, message: "Logged out successfully" })
    } catch (err) {
        next(err)
    }
})

export default router
