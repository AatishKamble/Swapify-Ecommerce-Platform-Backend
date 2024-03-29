import mongoose from "mongoose";
const orderSchema=new mongoose.Schema(
{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    orderItems:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"orderItems",
            required:true
        }
    ],

    deliveryDate:{
        type:Date,
    },
    shippingAddress:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'address',
        required:true
    },
    paymentDetails:{
        
        paymentMethod:{
            type:String,
        },
        transactionId:{
            type:String,
        },
        paymentId:{
            type:String,
        },
        paymentStatus:{
            type:String,
        }
    },
    orderStatus:{
        type:String,
        required:true,
        default:"PENDING"
    },
    totalPrice:{
        type:Number,
        required:true
    },
    totalItems:{
        type:Number,
        required:true,
        default:0
    },
    orderDate:{
        type:Date,
        default:Date.now,
    },

});

const Order=mongoose.model("orders",orderSchema);

export default Order;