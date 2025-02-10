import express from "express"
import Deck from "../models/Deck.js"
import requiresAuth from "../middleware/requiresAuth.js"
import { hasUser } from "../utils/hasUser.js"

const router = express.Router()

// @route GET /api/deck/test
// @desc Test the Deck route
// @access Public
router.get("/test", (req, res) => {
    res.send("Decks route working")
})

// @route GET /api/deck
// @desc Get user's Deck
// @access Private
router.get("/", requiresAuth, async (req, res, next) => {
    try {
        if (!hasUser(req)) {
            return res.status(404).json({ error: "User not found" })
        }

        const deck = await Deck.findOne({
            user: req.user._id,
        }).lean()

        res.json(deck)
        return
    } catch (error) {
        next(error)
    }
})

// @route POST /api/deck
// @route Create a new user Deck
// @access Private
router.post("/", requiresAuth, async (req, res, next) => {
    try {
        if (!hasUser(req)) {
            res.status(404).json({ error: "User not found" })
            return
        }

        const newDeck = new Deck({
            user: req.user._id,
            cards: [],
        })

        await newDeck.save()

        res.json(newDeck)
        return
    } catch (error) {
        next(error)
    }
})

// @route PUT /api/deck/add
// @desc Add a card to user's Deck
// @access Private
router.put("/add", requiresAuth, async (req, res, next) => {
    try {
        if (!hasUser(req)) {
            res.status(404).json({ error: "User not found" })
            return
        }

        const cardData = req.body

        const deck = await Deck.findOneAndUpdate({ user: req.user._id }, { $push: { cards: cardData } }, { new: true })

        if (!deck) {
            res.status(404).json({ error: "User deck not found" })
            return
        }

        res.json(deck)
        return
    } catch (error) {
        next(error)
    }
})

// @route PUT /api/deck/:card_id/remove
// @desc Remove card from user's deck
// @access Private
router.put("/:card_id/remove", requiresAuth, async (req, res, next) => {
    try {
        if (!hasUser(req)) {
            res.status(404).json({ error: "User not found" })
            return
        }

        const deck = await Deck.findOneAndUpdate(
            { user: req.user._id },
            { $pull: { cards: { _id: req.params.card_id } } },
            { new: true }
        )

        if (!deck) {
            res.status(404).json({ error: "User deck not found" })
            return
        }

        res.json(deck)
        return
    } catch (error) {
        next(error)
    }
})

// @route PUT /api/deck/empty
// @desc Empty user's deck
// @access Private
router.put("/empty", requiresAuth, async (req, res, next) => {
    try {
        if (!hasUser(req)) {
            res.status(404).json({ error: "User not found" })
            return
        }

        const deck = await Deck.findOneAndUpdate({ user: req.user._id }, { $set: { cards: [] } }, { new: true })

        if (!deck) {
            res.status(404).json({ error: "User deck not found" })
            return
        }

        res.json(deck)
        return
    } catch (error) {
        next(error)
    }
})

export default router
