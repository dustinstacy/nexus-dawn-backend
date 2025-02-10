import express from "express"
import Collection from "../models/Collection.js"
import User from "../models/User.js"
import requiresAuth from "../middleware/requiresAuth.js"
import { hasUser } from "../utils/hasUser.js"

const router = express.Router()

// @route GET /api/collections/test
// @desc Test the Collections route
// @access Public
router.get("/test", (req, res) => {
    res.send("Collection route working")
})

// @route GET /api/collections
// @desc Get user's Collection
// @access Private
router.get("/", requiresAuth, async (req, res, next) => {
    try {
        if (!hasUser(req)) {
            return res.status(404).json({ error: "User not found" })
        }

        const collection = await Collection.findOne({
            user: req.user._id,
        }).lean()

        res.json(collection)
        return
    } catch (error) {
        next(error)
    }
})

// @route POST /api/collections
// @route Create new user Collection
// @access Private
router.post("/", requiresAuth, async (req, res, next) => {
    try {
        if (!hasUser(req)) {
            res.status(404).json({ error: "User not found" })
            return
        }

        const user = await User.findOne({
            _id: req.user._id,
        })

        const newCollection = new Collection({
            user: user._id,
            cards: [],
        })

        await newCollection.save()

        res.json(newCollection)
        return
    } catch (error) {
        next(error)
    }
})

// @route PUT /api/collections/new
// @route Add a new card to user's Collection
// @access Private
router.put("/new", requiresAuth, async (req, res, next) => {
    try {
        if (!hasUser(req)) {
            res.status(404).json({ error: "User not found" })
            return
        }

        const cardData = req.body

        const collection = await Collection.findOneAndUpdate(
            { user: req.user._id },
            { $push: { cards: cardData } },
            { new: true }
        )

        if (!collection) {
            res.status(404).json({ error: "Collection not found" })
            return
        }

        res.json(collection)
        return
    } catch (error) {
        next(error)
    }
})

// @route PUT /api/collections/:cardId/:action
// @desc Update a card in user's Collection
// @access Private
router.put("/:cardId/:action", requiresAuth, async (req, res, next) => {
    try {
        if (!hasUser(req)) {
            res.status(404).json({ error: "User not found" })
            return
        }

        const collection = await Collection.findOne({
            user: req.user._id,
        })

        if (!collection) {
            res.status(404).json({ error: "Collection not found" })
            return
        }

        const card = collection.cards.find((card) => card._id.toString() === req.params.cardId)

        if (!card) {
            res.status(404).json({ error: "Card not found" })
            return
        }

        switch (req.params.action) {
            case "update":
                card.values = req.body.values
                card.empower = req.body.empower
                card.weaken = req.body.weaken
                card.xp = req.body.xp
                card.level = req.body.level
                card.timesPlayed = req.body.timesPlayed
                card.enemiesConverted = req.body.enemiesConverted
                await collection.save()
                res.json(card)
                return
            case "select":
                if (card.selected) {
                    res.status(400).json({ error: "Card already selected" })
                    return
                }
                card.selected = true
                await collection.save()
                res.json(collection)
                return
            case "unselect":
                if (!card.selected) {
                    res.status(400).json({ error: "Card already unselected" })
                    return
                }
                card.selected = false
                await collection.save()
                res.json(collection)
                return
            default:
                res.status(400).json({ error: "Invalid action" })
                return
        }
    } catch (error) {
        next(error)
    }
})

// @route DELETE /api/collections/:cardId/delete
// @desc Remove card from user's collection
// @access Private
router.delete("/:cardId/delete", requiresAuth, async (req, res, next) => {
    try {
        if (!hasUser(req)) {
            res.status(404).json({ error: "User not found" })
            return
        }

        const collection = await Collection.findOne({
            user: req.user._id,
        })

        if (!collection) {
            res.status(404).json({ error: "Collection not found" })
            return
        }

        const cardIndex = collection.cards.findIndex((card) => card._id.toString() === req.params.cardId)

        if (cardIndex === -1) {
            res.status(404).json({ error: "Card not found" })
            return
        }

        collection.cards.splice(cardIndex, 1)

        await collection.save()

        res.json({ success: true })
        return
    } catch (error) {
        next(error)
    }
})

export default router
