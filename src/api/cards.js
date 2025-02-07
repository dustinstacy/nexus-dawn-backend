import express from "express"
import Card from "../models/Card.js"
import requiresAuth from "../middleware/requiresAuth.js"
import requiresAdmin from "../middleware/requiresAdmin.js"

const router = express.Router()

// @route GET /api/cards/test
// @desc Test the auth route
// @access Public
router.get("/test", (req, res) => {
    res.send("Cards route working")
})

// @route GET /api/cards
// @desc Get all released cards
// @access Public
router.get("/", async (req, res, next) => {
    try {
        const cards = await Card.find()

        res.json(cards)
    } catch (error) {
        next(error)
    }
})

// @route POST /api/cards/new
// @desc Release new card
// @access Admin
router.post("/new", requiresAuth, requiresAdmin, async (req, res, next) => {
    try {
        const { name, number, image, rarity, element } = req.body

        const newCard = new Card({
            name,
            number,
            image,
            rarity,
            element,
        })

        await newCard.save()
        res.json(newCard)
    } catch (error) {
        next(error)
    }
})

// @route PUT /api/cards/:cardId
// @desc Update released card
// @desc Admin
router.put("/:cardId", requiresAuth, requiresAdmin, async (req, res, next) => {
    try {
        const { name, number, image, rarity, element } = req.body

        const updatedCard = await Card.findOneAndUpdate(
            {
                _id: req.params.cardId,
            },
            {
                name,
                number,
                image,
                rarity,
                element,
            },
            {
                new: true,
            }
        )

        if (!updatedCard) {
            return res.status(404).json({ error: "Card not found" })
        }

        res.json(updatedCard)
    } catch (error) {
        next(error)
    }
})

// @route DELETE /api/cards/:cardId/delete
// @desc Remove released card
// @access Admin
router.delete("/:cardId/remove", requiresAuth, requiresAdmin, async (req, res, next) => {
    try {
        const card = await Card.findOneAndDelete({ _id: req.params.cardId })

        if (!card) {
            return res.status(404).json({ success: false, error: "Card not found" })
        }
    } catch (error) {
        next(error)
    }
})

export default router
