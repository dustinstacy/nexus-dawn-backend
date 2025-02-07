import express from "express"
import User from "../models/User.js"
import requiresAuth from "../middleware/requiresAuth.js"
import {
    validateRegisterInput,
    checkForExistingEmail,
    checkForExistingUsername,
} from "../middleware/reigsterValidation.js"

const router = express.Router()

// @route GET /api/profile/test
// @desc Test the profile route
// @access Public
router.get("/test", (req, res) => {
    res.send("Profile route working")
})

// @route PUT /api/profile/:action
// @desc Update user's profile
// @access Private
router.put("/:action", requiresAuth, checkForExistingEmail, checkForExistingUsername, async (req, res, next) => {
    console.log("req.params", req.params)
    console.log("Action received:", req.params.action)
    try {
        const user = await User.findOne({ _id: req.user._id })
        console.log("req.params", req.params)
        console.log("Action received:", req.params.action)

        if (!user) {
            res.status(404).json({ error: "User not found" })
            return
        }

        const { errors, isValid } = validateRegisterInput(req.body)
        console.log("req.params", req.params)
        console.log("Action received:", req.params.action)

        if (!isValid) {
            res.status(400).json(errors)
            return
        }

        console.log("req.params", req.params)
        console.log("Action received:", req.params.action)

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
        console.log("req.params", req.params)
        console.log("Action received:", req.params.action)
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
