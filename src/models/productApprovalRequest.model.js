import mongoose from "mongoose";

const productApprovalRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',
    },
    productName: {
        type: String,
        required: true,
    },
    productDescription: {
        type: String,
        required: true,
    },
    expectedPrice: {
        type: Number,
        required: true,
    },
    state:{
        type:String,
        default:"sellrequest",
    },
    images: [{
        imageUrl:{
            type:String,
            required:false
        },
    publicId:{
        type:String,
        required:false
    }
    }],
    address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'address'
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const PARequest = mongoose.model("productApprovalRequests", productApprovalRequestSchema);
export default PARequest;
