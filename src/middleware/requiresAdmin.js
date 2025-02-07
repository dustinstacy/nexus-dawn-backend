const requiresAdmin = async (req, res, next) => {
    try {
        const user = req.user

        if (user.role === "admin") {
            next()
            return
        } else {
            res.status(403).json({ error: "Forbidden" }) // User is not authorized as an admin
            return
        }
    } catch (error) {
        next(error)
    }
}

export default requiresAdmin
