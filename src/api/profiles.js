import express from "express"
import User from "../models/User.js"
import requiresAuth from "../middleware/requiresAuth.js"
import { hasUser } from "../utils/hasUser.js"
import {
    validateRegisterInput,
    checkForExistingEmail,
    checkForExistingUsername,
} from "../middleware/registerValidation.js"

const router = express.Router()

// @route GET /api/profiles/test
// @desc Test the Profiles route
// @access Public
router.get("/test", (req, res) => {
    res.send("Profile route working")
})

// @route GET /api/profiles/:action
// @desc Get user's profile data
// @access Private
router.get("/:action", requiresAuth, async (req, res, next) => {
    try {
        if (!hasUser(req)) {
            return res.status(400).json({ error: "No user found" })
        }

        const user = await User.findOne({ _id: req.user._id })

        switch (req.params.action) {
            case "image":
                res.json({
                    image: user.image,
                })
                break
            case "coin":
                res.json({
                    coin: user.coin,
                })
                break
            case "xp":
                res.json({
                    xp: user.xp,
                })
                break
            case "level":
                res.json({
                    level: user.level,
                })
                break
            case "inventory":
                res.json({
                    inventory: user.inventory,
                })
                break
            case "onboardingStage":
                res.json({
                    onboardingStage: user.onboardingStage,
                })
                break
            default:
                res.status(400).json({ error: "Invalid action" })
                return
        }
    } catch (error) {
        next(error)
    }
})

// @route PUT /api/profiles/:action
// @desc Update user's profile
// @access Private
router.put("/:action", requiresAuth, checkForExistingEmail, checkForExistingUsername, async (req, res, next) => {
    try {
        if (!hasUser(req)) {
            return res.status(400).json({ error: "No user found" })
        }

        const user = await User.findOne({ _id: req.user._id })

        const { errors, isValid } = validateRegisterInput(req.body)

        if (!isValid) {
            res.status(400).json(errors)
            return
        }

        const {
            role,
            username,
            email,
            image,
            color,
            activeBattle,
            coin,
            level,
            xp,
            battles,
            wins,
            losses,
            draws,
            inventory,
            onboardingStage,
        } = req.body

        let updatedFields = {}

        switch (req.params.action) {
            case "info":
                updatedFields = {
                    role: role || user.role,
                    username: username || user.username,
                    email: email || user.email,
                    image: image || user.image,
                    color: color || user.color,
                    activeBattle: activeBattle || user.activeBattle,
                    coin: coin || user.coin,
                }
                break
            case "stats":
                updatedFields = {
                    level: level || user.level,
                    xp: xp || user.xp,
                    stats: {
                        battles: battles || user.stats.battles,
                        wins: wins || user.stats.wins,
                        losses: losses || user.stats.losses,
                        draws: draws || user.stats.draws,
                    },
                }
                break
            case "inventory":
                updatedFields = {
                    inventory: inventory,
                }
                break
            case "onboarding":
                updatedFields = {
                    onboardingStage: onboardingStage,
                }
                break
            default:
                res.status(400).json({ error: "Invalid action" })
                return
        }

        const updatedUser = await User.findOneAndUpdate({ _id: req.user._id }, updatedFields, { new: true })

        res.json(updatedUser)
    } catch (error) {
        next(error)
    }
})

export default router
