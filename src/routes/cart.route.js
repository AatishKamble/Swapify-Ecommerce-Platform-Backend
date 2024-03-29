import express from "express";

const router=express.Router();

import cartController from "../controller/cart.controller.js";
import authenticate from "../middleware/authenticate.js";

router.get("/",authenticate,cartController.getUserCart);
router.post('/add',authenticate,cartController.addToCart);

export default router;