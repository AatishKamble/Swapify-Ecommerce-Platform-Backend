import mongoose from "mongoose";

const cartSchema=new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"users",
            required:true
        },
        cartItems:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"cartItems",
            }
        ],
        totalPrice:{
            type:Number,
            required:true,
            default:0
        },
        totalItems:{
            type:Number,
            required:true,
            default:0
        }

    }
);

const Cart=mongoose.model("cart",cartSchema);

export default Cart;