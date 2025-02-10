import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import * as dotenv from "dotenv"
import authRoutes from "./api/auth.js"
import profileRoutes from "./api/profiles.js"
import cardRoutes from "./api/cards.js"
import itemRoutes from "./api/items.js"
import battleLogRoutes from "./api/battleLogs.js"
import collectionRoutes from "./api/collections.js"
import cpuOpponentRoutes from "./api/cpuOpponents.js"
import deckRoutes from "./api/decks.js"
import errorHandler from "./middleware/errors.js"
import { MONGO_DEV_URI, PORT } from "./utils/helperConfig.js"

dotenv.config()

const app = express()

// CORS allowed origins
const allowedOrigins = ["http://localhost:5173", "https://yourfrontenddomain.com"]

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}

app.use(express.json())
app.use(cors(corsOptions))
app.use(errorHandler)

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/profiles", profileRoutes)
app.use("/api/cards", cardRoutes)
app.use("/api/items", itemRoutes)
app.use("/api/battleLogs", battleLogRoutes)
app.use("/api/collections", collectionRoutes)
app.use("/api/cpuOpponents", cpuOpponentRoutes)
app.use("/api/decks", deckRoutes)

const MONGO_URI = process.env.MONGO_URI || MONGO_DEV_URI

const LOCAL_PORT = process.env.PORT || PORT

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("*****Connected to database*****")
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB:", error)
    })

app.get("/", (req, res) => {
    res.send("Server Running")
})

// Start the server
app.listen(LOCAL_PORT, () => {
    console.log(`Server running on http://localhost:${LOCAL_PORT}`)
})
