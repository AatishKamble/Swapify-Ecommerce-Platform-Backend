import express from "express";
import productController from '../controller/product.controller.js';

const router=express.Router();

router.get('/',productController.getAllProducts);
router.get('/id/:id',productController.findProductById);
router.get("/search", productController.searchProducts)

export default router;