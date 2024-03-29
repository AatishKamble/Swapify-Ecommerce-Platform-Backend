import express from "express";
import authenticate from "../middleware/authenticate.js";
import cartItemController from "../controller/cartItem.controller.js";

const router=express.Router();


router.put("/update/:id",authenticate,cartItemController.updateCartItem);
router.delete("/delete/:id",authenticate,cartItemController.removeCartItem);

export default router;