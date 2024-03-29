import express from "express";
import PARequestController from "../controller/PARequest.controller.js";
import authenticate from "../middleware/authenticate.js";

const route=express.Router();

route.get("/",authenticate,PARequestController.getAllProductRequests);//working

route.delete("/id/:id",authenticate,PARequestController.rejectProductRequest);//working

route.post("/:id",authenticate,PARequestController.approveProductRequest);//working

route.get("/:id",authenticate,PARequestController.findProductByProductRequestId);//working


export default route;