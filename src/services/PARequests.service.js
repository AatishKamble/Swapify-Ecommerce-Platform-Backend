import PARequest from "../models/productApprovalRequest.model.js";
import Categories from "../models/category.model.js";
import Address from "../models/address.model.js";
import userService from "../services/user.service.js";
import productService from "./product.service.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../config/Cloudnary.js";
async function createProductRequest(userId, reqData,files) {
    console.log("Received Files in Service:", files);
    const user = await userService.getUserById(userId);
    if (!user) {
        throw new Error(`User not found with id: ${userId}`);

    }
    
    let topLevelCategory = await Categories.findOne({ name: reqData.mainCategory });
    if (!topLevelCategory) {
        topLevelCategory = new Category({
            name: reqData.mainCategory,
            level: 1
        });
        await topLevelCategory.save();
    }
    
    let secondLevelCategory = await Categories.findOne({ name: reqData.subcategory });
    if (!secondLevelCategory) {
        secondLevelCategory = new Categories({
            name: reqData.subcategory,
            parentCategory: topLevelCategory._id,
            level: 2
        });
        await secondLevelCategory.save();
    }
        
const add = JSON.parse(reqData.address);
    let address = await Address.findOne({
        street: add.street,
        village: add.village,
        city: add.city,
        state: add.state,
        pincode: add.pincode,
        user: user._id,
        
    });


    if (!address) {
        address = new Address({
            street: add.street,
            village:add.village,
            city: add.city,
            state: add.state,
            pincode: add.pincode,
            user: user._id
        });
        await address.save();
    }

  
   
    let filesUrl = [];

    // Upload images to Cloudinary
    if (files && files.length > 0) {
        for (const file of files) {
            try {
              
                 
                const uploadedImage = await uploadOnCloudinary(file.path);
                if (uploadedImage) {
                    filesUrl.push({
                        imageUrl: uploadedImage.secure_url,
                        publicId: uploadedImage.public_id
                    });
                } else {
                    console.warn(`Failed to upload: ${file.path}`);
                }
            } catch (error) {
                console.error(`Error uploading file: ${file.path}`, error);
            }
        }
    }

    const productRequest = new PARequest({
        user: user._id,
        productName: reqData.productName,
        productDescription: reqData.productDescription,
        expectedPrice: reqData.expectedPrice,
        category: secondLevelCategory._id,
        address: [address._id],
        images: filesUrl
    });

    
   

    const newRequest = await productRequest.save();
    user.productRequests.push(newRequest._id);
    await user.save(); 

    return newRequest;
}





async function getAllProductRequests() {
    

    let query = PARequest.find().populate("user").populate("category").populate("address"); //{state:"sellrequest"}

    let totalRequests = await PARequest.countDocuments(query);
    

    const productRequests = await query.exec();
    const totalPages = Math.ceil(totalRequests / 10);
    return { content: productRequests,totalPages };

}

async function findProductByProductRequestId(productId) {
    const product = await PARequest.findById(productId).populate("category").populate("address").exec();
    if (!product) {
        throw new Error("Product not Found with id " + productId);
    }
    return product;

}

async function approveProductRequest(productId){
try {
    const product= await findProductByProductRequestId(productId);
    if (!product) {
        throw new Error("Product not Found with id " + productId);
    }
   
     await productService.addApprovedProduct(product);
     product.state="Request_Approved";
     await product.save();


     return await getAllProductRequests();

} catch (error) {
    throw new Error(error.message);
}
    
}

async function rejectProductRequest(productId){
    try {
        const product=await findProductByProductRequestId(productId);
        if (!product) {
            throw new Error("Product not Found with id " + productId);
        }
       
         product.state="Request_Rejected";
         await product.save();
         
         return await getAllProductRequests();


        
        
    } catch (error) {
        throw new Error(error.message);
    }

}
//for user to delete request
async function deleteProductRequest(userId,productId){
    try {
        const user=await userService.getUserById(userId);
        if(!user){
            throw new Error("user not found with id",userId);
        }
        const product=await findProductByProductRequestId(productId);
        product.state = "cancelrequest";
        await product.save();
        return product._id;
    } catch (error) {
        throw new Error(error.message);
    }
   
}


async function findProductReq(reqQuery) {
   
    try {
        
        let query = PARequest.find({ user: reqQuery })
            .populate("category")
            .populate("address");

        let totalRequests = await PARequest.countDocuments({ user: reqQuery });

        const productRequests = await query.exec();

        return { content: productRequests, totalRequests }; 
    } catch (error) {
        throw new Error("Error fetching product requests: " + error.message);
    }
}



export default {
    createProductRequest,
    getAllProductRequests,
    findProductByProductRequestId,
    approveProductRequest,
    deleteProductRequest,
    rejectProductRequest,
    findProductReq,


}
