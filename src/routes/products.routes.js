import express from "express";
const router=express.Router();

import productController from '../controller/product.controller.js';


router.get('/',productController.getAllProducts);
router.get('/id/:id',productController.findProductById);

export default router;