// Middleware to check if the user is an admin
const requiresAdmin = async (req, res, next) => {
    try {
        const user = req.user

        if (user.role === "admin") {
            next()
            return
        } else {
            res.status(403).json({ error: "Forbidden" })
            return
        }
    } catch (error) {
        next(error)
    }
}

export default requiresAdmin
