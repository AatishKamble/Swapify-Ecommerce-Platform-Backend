import express from "express";

const router=express.Router();

import userController from "../controller/user.controller.js";

router.get("/profile",userController.getUserProfile);
router.get("/",userController.getAllUsers);



export default router;

