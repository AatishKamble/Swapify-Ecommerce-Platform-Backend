import PARequest from "../models/productApprovalRequest.model.js"
import Categories from "../models/category.model.js"
import Address from "../models/address.model.js"
import userService from "../services/user.service.js"
import productService from "./product.service.js"
import { uploadOnCloudinary } from "../config/Cloudnary.js"

async function createProductRequest(userId, reqData, files) {
    
    const user = await userService.getUserById(userId);
    if (!user) {
        throw new Error(`User not found with id: ${userId}`);
    }

    let topLevelCategory = await Categories.findOne({ name: reqData.mainCategory });
    if (!topLevelCategory) {
        topLevelCategory = new Categories({
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
        address: add.address,
        locality: add.locality,
        fullName: add.fullName,
        city: add.city,
        state: add.state,
        pincode: add.pincode,
        user: user._id,
    });

    if (!address) {
        address = new Address({
            user: user._id,
            fullName: add.fullName || user.firstName + " " + user.lastName || "",
            phone: add.phone || user.mobileNumber || "0000000000",
            pincode: add.pincode || "000000",
            locality: add.locality || "",
            address: add.address || "",
            city: add.city,
            state: add.state,
            addressType: add.addressType || "home",
            isDefault: add.isDefault || false,
        });
        const newAddress = await address.save();
        user.address.push(newAddress._id);
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
        images: filesUrl,
        state: "sellrequest", // Explicitly set the initial state
    });

    const newRequest = await productRequest.save();
    user.productRequests.push(newRequest._id);
    await user.save();
    
    return newRequest;
}

async function getAllProductRequests() {
    let query = PARequest.find().populate("user").populate("category").populate("address"); // {state:"sellrequest"}

    let totalRequests = await PARequest.countDocuments(query);

    const productRequests = await query.exec();
    const totalPages = Math.ceil(totalRequests / 10);
    return { content: productRequests, totalPages };
}

async function findProductByProductRequestId(productId) {
    const product = await PARequest.findById(productId).populate("category").populate("address").exec();
    if (!product) {
        throw new Error("Product not Found with id " + productId);
    }
    return product;
}

async function approveProductRequest(productId) {
    try {
        const product = await findProductByProductRequestId(productId);
        if (!product) {
            throw new Error("Product not Found with id " + productId);
        }

        await productService.addApprovedProduct(product);
        product.state = "Request_Approved";
        await product.save();

        return await getAllProductRequests();
    } catch (error) {
        throw new Error(error.message);
    }
}

async function rejectProductRequest(productId) {
    try {
        const product = await findProductByProductRequestId(productId);
        if (!product) {
            throw new Error("Product not Found with id " + productId);
        }

        product.state = "Request_Rejected";
        await product.save();

        return await getAllProductRequests();
    } catch (error) {
        throw new Error(error.message);
    }
}

// For user to delete request
async function cancelProductRequest(userId, productId) {
    try {
        const user = await userService.getUserById(userId);
        if (!user) {
            throw new Error("user not found with id", userId);
        }
        
        const product = await findProductByProductRequestId(productId);
        product.state = "cancelrequest";
        await product.save();

        return product._id;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function acceptCancelRequest(productId) {
    try {
        const product = await findProductByProductRequestId(productId);
        if (!product) {
            throw new Error("Product not Found with id " + productId);
        }

        // await productService.deleteProduct(product._id);
        product.state = "Cancel_Approved";
        await product.save();

        return await getAllProductRequests();
    } catch (error) {
        throw new Error(error.message);
    }
}

async function rejectCancelRequest(productId) {
    try {
        const product = await findProductByProductRequestId(productId);
        if (!product) {
            throw new Error("Product not Found with id " + productId);
        }

        product.state = "Request_Approved";
        await product.save();

        return await getAllProductRequests();
    } catch (error) {
        throw new Error(error.message);
    }
}

async function findProductReq(reqQuery) {
    try {
        const query = PARequest.find({ user: reqQuery }).populate("category").populate("address")
    
        const totalRequests = await PARequest.countDocuments({ user: reqQuery })
    
        const productRequests = await query.exec()
    
        // Create an array to hold updated requests
        const updatedRequests = []
    
        for (const request of productRequests) {
            // Check if the request has a productId
            if (request.productId) {
                const product = await productService.findProductById(request.productId)
                if (product && product.state === "Sold") {
                    // Update the in-memory object as well
                    request.state = "Sold"
                }
            }
            updatedRequests.push(request)
        }
    
        return { content: updatedRequests, totalRequests }
    } catch (error) {
      
        throw new Error("Error fetching product requests: " + error.message)
    }
}

async function countRequestsByStatus(status) {
    try {
        const count = await ProductApprovalRequest.countDocuments({ state: status });
        return count;
    } catch (error) {
        throw new Error(`Error counting requests by status: ${error.message}`);
    }
}

// Count total products
async function countTotalProducts() {
    try {
        const count = await Product.countDocuments();
        return count;
    } catch (error) {
        throw new Error(`Error counting total products: ${error.message}`);
    }
}

// Count active sellers
async function countActiveSellers() {
    try {
        // Count unique users who have at least one approved product
        const count = await User.countDocuments({
            productRequests: { $exists: true, $ne: [] },
        });
        return count;
    } catch (error) {
        throw new Error(`Error counting active sellers: ${error.message}`);
    }
}

export default {
    createProductRequest,
    getAllProductRequests,
    findProductByProductRequestId,
    approveProductRequest,
    cancelProductRequest,
    rejectProductRequest,
    acceptCancelRequest,
    rejectCancelRequest,
    findProductReq,
    countRequestsByStatus,
    countTotalProducts,
    countActiveSellers,
};
