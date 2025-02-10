import { Schema, model } from "mongoose"

// Base Card schema for display use
const CardSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        number: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        rarity: {
            type: String,
            required: true,
        },
        element: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

const Card = model("Card", CardSchema)

export default Card
