import express from "express";
import authenticate from "../middleware/authenticate.js";
import addressController from "../controller/userAddress.controller.js"
const route=express.Router();

route.post("/create",authenticate,addressController.createNewAddress);
route.get("/",authenticate,addressController.getAddresses);

export default route;