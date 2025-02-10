import { Schema, model } from "mongoose"

const BattleLogSchema = new Schema(
    {
        battleNumber: {
            type: Number,
            required: true,
            unique: true,
        },
        battleLog: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

const BattleLog = model("BattleLog", BattleLogSchema)

export default BattleLog
