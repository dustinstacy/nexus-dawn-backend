import { Schema, model } from "mongoose"

// Card schema for those added to a deck (lighter weight than full card schema)
const DeckSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        cards: [
            {
                _id: {
                    type: Schema.Types.ObjectId,
                    required: true,
                },
                image: {
                    type: String,
                    required: true,
                },
                empower: {
                    type: String,
                },
                weaken: {
                    type: String,
                },
                values: [
                    {
                        type: Number,
                        required: true,
                    },
                ],
            },
        ],
    },
    {
        timestamps: true,
    }
)

const Deck = model("Deck", DeckSchema)

export default Deck
