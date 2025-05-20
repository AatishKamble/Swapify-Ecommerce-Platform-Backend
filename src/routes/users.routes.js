import express from "express"
import userController from "../controller/user.controller.js"
import authenticate from "../middleware/authenticate.js"

const router = express.Router()

router.get("/profile", userController.getUserProfile)
router.get("/", userController.getAllUsers)
router.put("/update", authenticate, userController.updateUserProfile)

export default router;
