
import express from "express";

const router=express.Router();

import adminOrderController from "../controller/adminOrder.controller.js";
import authenticate from "../middleware/authenticate.js";
router.get("/",authenticate,adminOrderController.getAllOrders);
router.delete("/delete/:orderId",authenticate,adminOrderController.deleteOrder);
router.put("/confirm-order/:orderId",authenticate,adminOrderController.confirmOrder);
router.put("/cancel/:orderId",authenticate,adminOrderController.cancelOrder);
router.put("/deliver/:orderId",authenticate,adminOrderController.deliverOrder);
router.put("/shipp/:orderId",authenticate,adminOrderController.shippOrder);


export default router;