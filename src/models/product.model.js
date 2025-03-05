import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'categories',
        },
        imageURL: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }

});

const Product = mongoose.model('products', productSchema);

export default Product;