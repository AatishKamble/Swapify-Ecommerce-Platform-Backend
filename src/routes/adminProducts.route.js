
import express from 'express';
const router=express.Router();
import productController from '../controller/product.controller.js';

router.post('/',productController.createProduct);
router.post('/creates',productController.createMultipleProducts);
router.delete('/id/:id',productController.deleteProduct);
router.put('/id/:id',productController.updateProduct);


export default router;
