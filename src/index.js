import express from "express";
import cors from "cors";
import "dotenv/config";



const app=express();


app.use(express.json());
app.use(cors());
express.urlencoded({ extended: true })
app.get("/",(req,res)=>{
    res.status(200).send({massage:"Welcome to Swapify API",status:true});
});

import authRouter from "./routes/auth.route.js";
app.use("/api/auth",authRouter);//working

import userRouter from "./routes/users.routes.js";
app.use("/api/users",userRouter);//working

app.use('/api/images',express.static("uploads"));

import adminRouter from "./routes/adminOrder.route.js";
app.use("/api/admin/orders",adminRouter);//working

import userOrderRouter from "./routes/userOrder.route.js";
app.use('/api/user/orders',userOrderRouter); //workinng

import cartRouter from "./routes/cart.route.js";
app.use("/api/cart",cartRouter);//working

import cartItemRouter from "./routes/cartItem.route.js";
app.use("/api/cart_items",cartItemRouter);//working


import productRouter from "../src/routes/products.routes.js";
app.use("/api/products",productRouter); //working

import adminProductRouter from "../src/routes/adminProducts.route.js";
app.use("/api/admin/products",adminProductRouter);//working

import pARUserRouter from "../src/routes/userPAR.route.js";
app.use("/api/user/sell-product",pARUserRouter);//one remaining


import adminPARRouter from "../src/routes/adminPAR.route.js";
app.use("/api/admin/product_request",adminPARRouter);//working

 
import addressRouter from "../src/routes/Address.route.js";
app.use("/api/address",addressRouter);
export default app;