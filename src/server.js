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
import errorHandler from "./middleware/errors.js"

dotenv.config()

const app = express()

// You can specify your frontend's URL here
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
app.use("/api/profile", profileRoutes)
app.use("/api/cards", cardRoutes)
app.use("/api/items", itemRoutes)
app.use("/api/battleLogs", battleLogRoutes)
app.use("/api/collection", collectionRoutes)
app.use("/api/cpuOpponents", cpuOpponentRoutes)

const MONGO_URI =
    process.env.MONGO_URI ||
    "mongodb+srv://cloudwalker0013:A3GeYLhO5pOjF6nc@development-data.e0khqcy.mongodb.net/?retryWrites=true&w=majority&appName=Development-Data"
const PORT = process.env.PORT || 5000

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
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
