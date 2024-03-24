
import Categories from '../models/category.model.js';
import areCategoriesExits from './category.service.js';
import areLocationExits from './address.service.js';
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



    let address = await Address.findOne({
        city: reqData.city,
        state: reqData.state,

    });

    if (!address) {
        address = new Address({
            city: reqData.city,
            state: reqData.state
        });
        await address.save();
    }


    const product = new Product(
        {

            title: reqData.title,
            description: reqData.description,
            price: reqData.price,
            category: secondLevel._id,
            imageURL: reqData.imageUrl,
            address: address._id,

        }
    );


    return await product.save();
}


async function deleteProduct(productId) {
    const product = findProductById(productId);

    await Product.findByIdAndDelete(productId);
    return "Product deleted Successfully";
}


async function updateProduct(productId, reqData) {

    return await Product.findByIdAndUpdate(productId, reqData);

}



async function findProductById(productId) {
    const product = await Product.findById(productId).populate("category").populate("address").exec();
    if (!product) {
        throw new Error("Product not Found with id " + productId);
    }
    return product;

}

async function getAllProducts(reqQuery) {
   
    let { category, location, minPrice, maxPrice,sort, pageNumber, pageSize } = reqQuery;
 
    pageSize = pageSize || 10;

     let query = Product.find().populate("category").populate("address");

    

    if (category) {
        let categorySet = new Set(category.split(",").map(category => category.trim()));
        
        const existingCategories = await Categories.find({ name:{$regex:new RegExp([...categorySet].join("|"),"i")} });
        if (existingCategories.length > 0) {

            const categoryIds = existingCategories.map(category => category._id);
                        query.where("category").in(categoryIds);
        } 
 
    }

    if (location) {
        let locationSet = new Set(location.split(",").map(location => location.trim()));
        const existingLocations=await Address.find({state:{ $regex: new RegExp([...locationSet].join('|'), 'i') }});
        if (existingLocations.length>0) {
          const locationIds=existingLocations.map(location=>location._id);
         
            query.where("address").in(locationIds);
        }
    }

    if (minPrice || maxPrice) {
        query.where("price").gte(minPrice).lte(maxPrice);
    }

    if(sort){
        if(sort==="asc-price")
        {
          query.sort({price:1});   
        }
        else if(sort==="by-date"){
            query.sort({createdAt:-1});
        }
        else{
            query.sort({price:-1}); 
        }
       
    }
   

    const totalProduct = await Product.countDocuments(query);
const skip = (pageNumber - 1) * pageSize;
query = query.skip(skip).limit(pageSize);
const products = await query.exec();

const totalPages = Math.ceil(totalProduct / pageSize);
return { content: products, currentPage: pageNumber, totalPages };
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
}