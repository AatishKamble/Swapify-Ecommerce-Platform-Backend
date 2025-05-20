
import Categories from '../models/category.model.js';

import Product from '../models/product.model.js';
import Address from '../models/address.model.js';


const createProduct = async (reqData) => {

    let topLevelCategory = await Categories.findOne({ name: reqData.topLevelCategory });

    if (!topLevelCategory) {
        topLevelCategory = new Categories({
            name: reqData.topLevelCategory,
            level: 1
        });
        await topLevelCategory.save();
    }

    let secondLevel = await Categories.findOne({
        name: reqData.secondLevelCategory,
        parentCategory: topLevelCategory._id,

    });
    if (!secondLevel) {
        secondLevel = new Categories({
            name: reqData.secondLevelCategory,
            parentCategory: topLevelCategory._id,
            level: 2
        });
        await secondLevel.save();
    }


    const product = new Product(
        {

            title: reqData.title,
            description: reqData.description,
            price: reqData.price,
            category: secondLevel._id,
            imageURL: reqData.imageUrl,
            // address: address._id,

        }
    );


    return await product.save();
}

async function addApprovedProduct(product){

    let p= product.expectedPrice + (product.expectedPrice*0.1);

    const approvedProduct = new Product(
        {
            title: product.productName,
            description: product.productDescription,
            price: p,
            category: product.category._id,
            imageURL: product.images[0].imageUrl,
            state: 'Unsold'
        }
    );
    
    
    return await approvedProduct.save();
}


async function deleteProduct(productId) {
    const product = findProductById(productId);

    await Product.findByIdAndDelete(productId);
    return "Product deleted Successfully";
}


async function updateProduct(productId, reqData) {
   const productUpdated= await Product.findByIdAndUpdate(productId, reqData,{new:true});

    return productUpdated;

}



async function findProductById(productId) {
    const product = await Product.findById(productId).populate("category").exec();
    
    // .populate("address");

    if (!product) {
        throw new Error("Product not Found with id " + productId);
    }
    return product;

}

async function getAllProducts(reqQuery) {
    let { category, minPrice, maxPrice, sort, pageNumber, pageSize } = reqQuery;

    // Parse numeric parameters
    pageSize = parseInt(pageSize) || 10;
    pageNumber = parseInt(pageNumber) || 1;
    minPrice = minPrice ? parseInt(minPrice) : 0;
    maxPrice = maxPrice ? parseInt(maxPrice) : 1000000;

    // Base query to find only unsold products
    let baseQuery = {
        $or: [
            { state: "Unsold" },
            { state: { $exists: false } },
            { state: null },
            { state: "" },
            { state: "Request_Approved" }
        ]
    };

    // Handle category search
    if (category) {
        // Clean up and normalize category input - handle various formats
        let categoryString = category.toString().trim();
        
        // Split by commas, colons, or multiple spaces and clean up
        const categoryTerms = categoryString
            .replace(/\s*:\s*/g, ',')  // Replace colons with commas
            .split(',')
            .map(term => term.trim())
            .filter(Boolean);
        
        if (categoryTerms.length > 0) {
            // Find all matching categories (direct matches)
            const directMatches = await Categories.find({
                name: { $regex: new RegExp(categoryTerms.map(term => 
                    term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i') }
            });
            
            // Create a set to hold all relevant category IDs
            const allCategoryIds = new Set();
            
            // Process each direct match
            for (const match of directMatches) {
                // Add this category
                allCategoryIds.add(match._id);
                
                // If this is a parent category (level === 1), find and add all its children
                if (match.level === 1) {
                    const children = await Categories.find({ parentCategory: match._id });
                    children.forEach(child => allCategoryIds.add(child._id));
                }
            }
            
            if (allCategoryIds.size > 0) {
                baseQuery.category = { $in: Array.from(allCategoryIds) };
            }
        }
    }

    // Add price filter
    if (minPrice || maxPrice) {
        baseQuery.price = {};
        if (minPrice) baseQuery.price.$gte = minPrice;
        if (maxPrice) baseQuery.price.$lte = maxPrice;
    }

    // Create the query
    let query = Product.find(baseQuery).populate("category");

    // Apply sorting
    if (sort) {
        if (sort === "asc-price") {
            query = query.sort({ price: 1 });
        } else if (sort === "Date-Created") {
            query = query.sort({ createdAt: -1 });
        } else {
            query = query.sort({ price: -1 });
        }
    } else {
        // Default sorting
        query = query.sort({ createdAt: -1 });
    }

    // Count total products for pagination
    const totalProduct = await Product.countDocuments(baseQuery);

    // Apply pagination
    if (pageNumber !== 0 && pageSize !== 0) {
        const skip = (pageNumber - 1) * pageSize;
        query = query.skip(skip).limit(pageSize);
    }

    // Execute the query
    const products = await query.exec();

    // Calculate total pages
    const totalPages = Math.ceil(totalProduct / pageSize);

    return { 
        content: products, 
        currentPage: pageNumber, 
        totalPages,
        totalItems: totalProduct
    };
}

async function createMultipleProducts(products) {

    for (const product of products) {

        await createProduct(product);
    }

}


export default {
    createProduct,
    deleteProduct,
    updateProduct,
    findProductById,
    getAllProducts,
    createMultipleProducts,
    addApprovedProduct,
}