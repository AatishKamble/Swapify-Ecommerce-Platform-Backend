import PARequest from "../models/productApprovalRequest.model.js";
import Categories from "../models/category.model.js";
import Address from "../models/address.model.js";
import userService from "../services/user.service.js";
import productService from "./product.service.js";
async function createProductRequest(userId, reqData) {

    const user = await userService.getUserById(userId);
    if (!user) {
        throw new Error("User not found with id", userId);
    }
    

    let topLevelCategory = await Categories.findOne({ name: reqData.topLevelCategory });
    if (!topLevelCategory) {
        topLevelCategory = new Categories({
            name: reqData.topLevelCategory,
            level: 1
        });
        await topLevelCategory.save();
    }
    let secondLevelCategory = await Categories.findOne({ name: reqData.secondLevelCategory });
    if (!secondLevelCategory) {
        secondLevelCategory = new Categories({
            name: reqData.secondLevelCategory,
            parentCategory: topLevelCategory,
            level: 2
        });
        await secondLevelCategory.save();
    }

    let address = await Address.findOne({
        firstName:reqData.firstName,
        lastName:reqData.lastName,
        mobile:reqData.mobile,
         houseNo:reqData.houseNo,
        streetAddress:reqData.streetAddress,
        city:reqData.city,
        state:reqData.state,
        zipCode:reqData.zipCode,
        user:user._id
   });

    if (!address) {
        address = new Address({
            firstName:reqData.firstName,
            lastName:reqData.lastName,
            mobile:reqData.mobile,
             houseNo:reqData.houseNo,
            streetAddress:reqData.streetAddress,
            city:reqData.city,
            state:reqData.state,
            zipCode:reqData.zipCode,
            user:user._id
        });
        await address.save();
    }

    const productRequest = new PARequest({
        user: user._id,
        title: reqData.title,
        description: reqData.description,
        expectedPrice: reqData.expectedPrice,
        category: secondLevelCategory._id,
        imageURL: reqData.imageUrl,
        address: address._id,
    });

    return await productRequest.save();
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
        await PARequest.findByIdAndDelete(productId);
        return "product request deleted";
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
    rejectProductRequest

}
