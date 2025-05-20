import userService from "../services/user.service.js"

const getUserProfile = async (req, res) => {
    try {
        const jwt = req.headers.authorization?.split(" ")[1]
        if (!jwt) {
            return res.status(404).send({ error: "Token not found" })
        }
        const user = await userService.getUserByToken(jwt)
        return res.status(200).send(user)
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers()
        return res.status(200).send(users)
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

const updateUserProfile = async (req, res) => {
    try {
        const jwt = req.headers.authorization?.split(" ")[1]
        if (!jwt) {
            return res.status(404).send({ error: "Token not found" })
        }

        const userId = req.user._id // Assuming middleware sets req.user
        const userData = req.body

        const updatedUser = await userService.updateUser(userId, userData)
        return res.status(200).send(updatedUser)
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

export default {
    getUserProfile,
    getAllUsers,
    updateUserProfile,
};