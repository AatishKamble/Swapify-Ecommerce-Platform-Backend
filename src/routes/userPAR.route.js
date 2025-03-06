import express from "express";
import authenticate from "../middleware/authenticate.js";
import PARequestController from "../controller/PARequest.controller.js";
import PARUserController from "../controller/PARUser.controller.js";
import upload from "../config/UploadMulter.js";
const route=express.Router();

route.post("/",authenticate,upload.array("productimages"),PARUserController.createProductRequest);//working
route.delete("/id/:id",authenticate,PARUserController.deleteProductRequest);//working
route.get('/:id',authenticate,PARequestController.findProductByProductRequestId)//working
route.get('/',authenticate,PARequestController.findProductReq)//working


export default route;
