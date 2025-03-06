import PARequest from "../models/productApprovalRequest.model.js";
import Categories from "../models/category.model.js";
import Address from "../models/address.model.js";
import userService from "../services/user.service.js";
import productService from "./product.service.js";
async function createProductRequest(userId, reqData) {
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
        secondLevelCategory = new Category({
            name: reqData.subcategory,
            parentCategory: topLevelCategory._id,
            level: 2
        });
        await secondLevelCategory.save();
    }
    
    let address = await Address.findOne({
        street: reqData.address.street,
        village: reqData.address.village,
        city: reqData.address.city,
        state: reqData.address.state,
        pincode: reqData.address.pincode,
        user: user._id
    });
    

    if (!address) {
        address = new Address({
            street: reqData.address.street,
            village: reqData.address.village,
            city: reqData.address.city,
            state: reqData.address.state,
            pincode: reqData.address.pincode,
            user: user._id
        });
        await address.save();
    }

    const productRequest = new PARequest({
        user: user._id,
        productName: reqData.productName,
        productDescription: reqData.productDescription,
        expectedPrice: reqData.expectedPrice,
        category: secondLevelCategory._id,
        images: Array.isArray(reqData.images) 
            ? reqData.images.filter(img => typeof img === 'string' && img.trim() !== '') 
            : [], // Ensure only valid strings are stored
        address: [address._id], 
    });
    
   

    const newRequest = await productRequest.save();
    user.productRequests.push(newRequest._id);
    await user.save(); 

    return newRequest;
}





async function getAllProductRequests(reqQuery) {
    let { pageNumber, pageSize } = reqQuery;

    pageSize = pageSize || 50;

    let query = PARequest.find().populate("category").populate("address");

    let totalRequests = await PARequest.countDocuments(query);
    const skip = (pageNumber - 1) * pageSize;
    query = query.skip(skip).limit(pageSize);

    const productRequests = await query.exec();
    const totalPages = Math.ceil(totalRequests / pageSize);
    return { content: productRequests, currentPage: pageNumber, totalPages };

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
    const product=await findProductByProductRequestId(productId);
    if (!product) {
        throw new Error("Product not Found with id " + productId);
    }
   
     const productApproved=await productService.addApprovedProduct(product);
    await deleteProductRequest(product.user,product._id);
     return productApproved;

} catch (error) {
    throw new Error(error.message);
}
    
}

async function rejectProductRequest(productId){
    try {
        const product=await findProductByProductRequestId(productId);
        await PARequest.findByIdAndDelete(productId);
        return "product request rejected";
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
   
    let query = PARequest.find({user:reqQuery}).populate("category").populate("address");
    return { content: productRequests, currentPage: pageNumber, totalPages };

}

const uploadImage = async (user, filesUrl) => {
    try {
    
  const newService=await PARequest.findByIdAndUpdate(
    {user:user},
    {images:filesUrl},
    { new: true }
  );
  
  
  return newService;
  
    } catch (error) {
      throw new Error(error.message);
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
    uploadImage

}
