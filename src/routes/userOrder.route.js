import express from "express";
import authenticate from "../middleware/authenticate.js";
import orderController from "../controller/order.controller.js";

const router=express.Router();

router.post("/create",authenticate,orderController.createOrder);
router.post("/place/:id",authenticate,orderController.placeOrder);
router.get("/:id",authenticate,orderController.getOrderById);
router.get("/",authenticate,orderController.orderHistory);
router.put("/cancel/:Id",authenticate,orderController.cancelOrder);

export default router;