import mongoose from "mongoose";

const orderItemSchema=new mongoose.Schema(
    {
        order:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"orders",
          
        },
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"products",
            required:true
        },
        price:{
            type:Number,
            required:true,
            default:0
        },
        quantity:{
            type:Number,
            required:true,
            default:1
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"users",
            required:true
        },



    }
);

const OrderItems=mongoose.model("orderItems",orderItemSchema);

export default OrderItems;