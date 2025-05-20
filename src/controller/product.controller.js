import productServices from "../services/product.service.js";
import Product from "../models/product.model.js";

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
    // console.log(productId)
   
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

const searchProducts = async (req, res) => {
    try {
        const query = req.query.q
    
        if (!query || query.trim().length < 2) {
            return res.status(400).json({ error: "Search query must be at least 2 characters" })
        }
    
        // Create a regex pattern for case-insensitive search
        const searchPattern = new RegExp(query, "i")
    
        // Search in title and description at any position
        const products = await Product.find({
            $and: [
                // First condition: Match search pattern in title OR description
                { $or: [
                    { title: { $regex: searchPattern } }, 
                    { description: { $regex: searchPattern }}
                ]},
                // Second condition: Product is unsold (any of these states)
                { $or: [
                    { state: "Unsold" },
                    { state: { $exists: false } },
                    { state: null },
                    { state: "" },
                    { state: "Request_Approved" }
                ]}
            ]
        })
        .populate("category")
        .limit(10) // Limit to 10 results for performance
  
        return res.status(200).json({
            content: products,
            totalElements: products.length,
        })
    } catch (error) {
        console.error("Error searching products:", error)
        return res.status(500).json({ error: error.message })
    }
}

export default {
    createProduct,
    deleteProduct,
    updateProduct,
    findProductById,
    getAllProducts,
    createMultipleProducts,
    searchProducts
}
