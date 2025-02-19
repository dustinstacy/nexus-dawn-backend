import express from "express"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
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
import { CLIENT_PORT, MONGO_DEV_URI, PORT } from "./utils/helperConfig.js"

dotenv.config()

const app = express()

const localClientPort = process.env.CLIENT_PORT || CLIENT_PORT

app.use(cookieParser())
app.use(express.json())
app.use(errorHandler)
app.use(
    cors({
        origin: [
            `http://localhost:${localClientPort}`,
            "https://nexus-dawn-itu5d3b9e-dustinstacys-projects.vercel.app/",
            "https://nexus-dawn.vercel.app/",
        ],
        credentials: true,
        exposedHeaders: ["Set-Cookie"],
        allowedHeaders: ["Content-Type", "Authorization", "credentials"],
    })
)

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

const localServerPort = process.env.PORT || PORT

// Start the server
app.listen(localServerPort, () => {
    console.log(`Server running on http://localhost:${localServerPort}`)
})
