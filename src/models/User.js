import { Schema, model } from "mongoose"
import bcrypt from "bcrypt"

const UserSchema = new Schema(
    {
        role: {
            type: String,
            default: "player",
        },
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: "",
        },
        color: {
            type: String,
            default: "#03303b",
        },

        level: {
            type: Number,
            default: 1,
        },
        xp: {
            type: Number,
            default: 0,
        },
        stats: {
            battles: {
                type: Number,
                default: 0,
            },
            wins: {
                type: Number,
                default: 0,
            },
            losses: {
                type: Number,
                default: 0,
            },
            draws: {
                type: Number,
                default: 0,
            },
        },
        activeBattle: {
            type: Boolean,
            default: false,
        },
        coin: {
            type: Number,
            default: 0,
        },
        inventory: [],
        onboardingStage: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
)

UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

// export the model
const User = model("User", UserSchema)

export default User
