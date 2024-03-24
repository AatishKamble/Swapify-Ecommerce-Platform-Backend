import productServices from "../services/product.service.js";

async function createProduct(req,res){
    try {
        
        const product=await productServices.createProduct(req.body);
       
        return res.status(201).send(product);
    } catch (error) {
       return res.status(500).send({error:error.massage})
    }
}

async function deleteProduct(req,res){
    const productId=req.params.id;
   
    try {
        const product=await productServices.deleteProduct(productId);
        return res.status(201).send(product);
    } catch (error) {
       return res.status(500).send({error:error.massage})
    }
}

async function updateProduct(req,res){
    const productId=req.params.id;
    try {
        const product=await productServices.updateProduct(productId,req.body);
        return res.status(201).send(product);
    } catch (error) {
       return res.status(500).send({error:error.massage})
    }
}

async function findProductById(req,res){
    const productId=req.params.id;
    try {
        const product=await productServices.findProductById(productId);
        return res.status(201).send(product);
    } catch (error) {
       return res.status(500).send({error:error.massage})
    }
}

async function getAllProducts(req,res){
   
    try {
    
        const product=await productServices.getAllProducts(req.query);
        return res.status(201).send(product);
    } catch (error) {
       return res.status(500).send({error:error.massage})
    }
}


async function createMultipleProducts(req,res){
    try {
      
        const product=await productServices.createMultipleProducts(req.body);
        return res.status(201).send({massage:"products created successfully",status:true});
    } catch (error) {
       return res.status(500).send({error:error.massage})
    }
}


export default {
    createProduct,
    deleteProduct,
    updateProduct,
    findProductById,
    getAllProducts,
    createMultipleProducts,
}
