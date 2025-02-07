import express from "express"
import Item from "../models/Item.js"
import requiresAuth from "../middleware/requiresAuth.js"
import requiresAdmin from "../middleware/requiresAdmin.js"

const router = express.Router()

// @route GET /api/items/test
// @desc Test the items route
// @access Public
router.get("/test", (req, res) => {
    res.send("Items route working")
})

// @route GET /api/items
// @desc Get all items
// @access Private
router.get("/", async (req, res, next) => {
    try {
        const items = await Item.find()

        res.json(items)
        return
    } catch (error) {
        next(error)
    }
})

// @route POST /api/items/
// @desc Add item to database
// @access Private
router.post("/", requiresAuth, requiresAdmin, async (req, res, next) => {
    try {
        const { name, image, type, level, info, price, contents } = req.body

        const newItem = new Item({
            name: name,
            image: image,
            type: type,
            level: level,
            info: info,
            price: price,
            contents: contents,
        })

        await newItem.save()
        res.json(newItem)
        return
    } catch (error) {
        next(error)
    }
})

// @route PUT /api/items/:itemId
// @desc Update item in database
// @access Private
router.put("/:itemId", requiresAuth, requiresAdmin, async (req, res, next) => {
    try {
        const { name, image, type, level, info, price, contents } = req.body

        const item = await Item.findOneAndUpdate(
            {
                _id: req.params.itemId,
            },
            {
                name: name,
                image: image,
                type: type,
                level: level,
                info: info,
                price: price,
                contents: contents,
            },
            {
                new: true,
            }
        )

        if (!item) {
            res.status(404).json({ error: "Item not found" })
            return
        }

        res.json(item)
        return
    } catch (error) {
        next(error)
    }
})

// @route DELETE /api/items/:itemId
// @desc Remove item from database
// @access Private
router.delete("/:itemId/remove", requiresAuth, requiresAdmin, async (req, res, next) => {
    try {
        const item = await Item.findOne({
            _id: req.params.itemId,
        })

        if (!item) {
            res.status(404).json({ error: "Item not found" })
            return
        }

        await Item.findByIdAndDelete({
            _id: req.params.itemId,
        })

        res.json({ success: true })
        return
    } catch (error) {
        next(error)
    }
})

export default router
