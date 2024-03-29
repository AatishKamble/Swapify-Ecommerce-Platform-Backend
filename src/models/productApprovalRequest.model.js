import mongoose from "mongoose";

const productApprovalRequestSchema=new mongoose.Schema(

    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"users",
            required:true
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        expectedPrice: {
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
        address:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'address'
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }

    }
);

const PARequest=mongoose.model("productApprovalRequests",productApprovalRequestSchema);

export default PARequest;