import express from "express";
import authenticate from "../middleware/authenticate.js";
import PARequestController from "../controller/PARequest.controller.js";
import PARUserController from "../controller/PARUser.controller.js";
const route=express.Router();

route.post("/",authenticate,PARUserController.createProductRequest);//working
route.delete("/id/:id",authenticate,PARUserController.deleteProductRequest);//working
route.get('/:id',authenticate,PARequestController.findProductByProductRequestId)//working
export default route;
