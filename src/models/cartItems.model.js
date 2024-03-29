import mongoose from "mongoose";

const cartItemSchema=new mongoose.Schema(
    {
        cart:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"cart",
            required:true
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
        }


    }
);

const CartItem=mongoose.model("cartItems",cartItemSchema);

export default CartItem;