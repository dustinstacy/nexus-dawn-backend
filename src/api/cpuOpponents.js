import express from "express"
import CPUOpponent from "../models/CPUOpponent.js"
import requiresAuth from "../middleware/requiresAuth.js"
import requiresAdmin from "../middleware/requiresAdmin.js"

const router = express.Router()

// @route GET /api/cpuOpponents/test
// @desc Test the CPU Oponnents route
// @access Public
router.get("/test", (req, res) => {
    res.send("CPU Opponent route working")
})

// @route GET /api/cpuOpponents
// @desc Get CPU Opponent
// @access Public
router.get("/", async (req, res, next) => {
    try {
        const cpuOpponents = await CPUOpponent.find()

        res.json(cpuOpponents)
        return
    } catch (error) {
        next(error)
    }
})

// @route POST /api/cpuOpponents/
// @route Add CPU Opponent
// @access Private
router.post("/", requiresAuth, requiresAdmin, async (req, res, next) => {
    try {
        const {
            name,
            avatar,
            image,
            color,
            level,
            deckOdds,
            cardCount,
            minPower,
            maxPower,
            rules,
            rounds,
            rewards: { xp, coin, items },
        } = req.body

        const newCPUOpponent = new CPUOpponent({
            name,
            avatar,
            image,
            color,
            level,
            deckOdds,
            cardCount,
            minPower,
            maxPower,
            rules,
            rounds,
            rewards: {
                xp: xp,
                coin: coin,
                items: items,
            },
        })

        await newCPUOpponent.save()
        res.json(newCPUOpponent)
        return
    } catch (error) {
        next(error)
    }
})

// @route PUT /api/cpuOpponents/:cpuOpponent_id
// @desc Update CPU Opponent
// @access Private
router.put("/:cpuOpponent_id", requiresAuth, requiresAdmin, async (req, res, next) => {
    try {
        const {
            name,
            avatar,
            image,
            color,
            level,
            deckOdds,
            cardCount,
            minPower,
            maxPower,
            rules,
            rounds,
            rewards: { xp, coin, items },
        } = req.body

        const cpuOpponent = await CPUOpponent.findOneAndUpdate(
            {
                _id: req.params.cpuOpponent_id,
            },
            {
                name,
                avatar,
                image,
                color,
                level,
                deckOdds,
                cardCount,
                minPower,
                maxPower,
                rules,
                rounds,
                rewards: {
                    xp: xp,
                    coin: coin,
                    items: items,
                },
            },
            {
                new: true,
            }
        )

        if (!cpuOpponent) {
            res.status(404).json({ error: "CPU Opponent not found" })
            return
        }

        res.json(cpuOpponent)
        return
    } catch (error) {
        next(error)
    }
})

// @route DELETE /api/cpuOpponents/:cpuOpponentId
// @desc Remove CPU Opponent
// @access Private
router.delete("/:cpuOpponentId", requiresAuth, async (req, res, next) => {
    try {
        const cpuOpponent = await CPUOpponent.findOne({
            _id: req.params.cpuOpponentId,
        })

        if (!cpuOpponent) {
            res.status(404).json({ error: "CPU Opponent not found" })
            return
        }

        await CPUOpponent.findByIdAndDelete({
            _id: req.params.cpuOpponentId,
        })

        res.json({ success: true })
        return
    } catch (error) {
        next(error)
    }
})

export default router
