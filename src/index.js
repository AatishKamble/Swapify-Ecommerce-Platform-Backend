import express from "express";
import cors from "cors";

const app=express();

app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
    res.status(200).send({massage:"Welcome to Swapify API",status:true});
});


import productRouter from "../src/routes/products.routes.js";
app.use("/api/products",productRouter);
import adminProductRouter from "../src/routes/adminProducts.route.js";
app.use("/api/admin/products",adminProductRouter);


export default app;