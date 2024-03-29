
import express from 'express';
const router=express.Router();
import productController from '../controller/product.controller.js';

router.get('/',productController.getAllProducts);
router.get('/id/:id',productController.findProductById);
router.post('/creates',productController.createMultipleProducts);// for temporory adding into database
router.delete('/id/:id',productController.deleteProduct);
router.put('/id/:id',productController.updateProduct);


export default router;
