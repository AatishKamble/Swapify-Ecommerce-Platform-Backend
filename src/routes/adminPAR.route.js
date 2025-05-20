import express from "express";
import PARequestController from "../controller/PARequest.controller.js";
import authenticate from "../middleware/authenticate.js";

const route=express.Router();

route.get("/",PARequestController.getAllProductRequests);//working

route.delete("/id/:id",PARequestController.rejectProductRequest);//working

route.post("/:id",PARequestController.approveProductRequest);//working

route.get("/:id",authenticate,PARequestController.findProductByProductRequestId);//working

route.get("/stats", PARequestController.getProductRequestStats);

// accepting cancel request
route.post("/cancel/:id", authenticate, PARequestController.acceptCancelRequest);

// rejecting cancel request
route.delete("/cancel/id/:id", authenticate, PARequestController.rejectCancelRequest);

export default route;