import mongoose from "mongoose";

const AddressesSchema=new mongoose.Schema({

    city:{
        type:String,
        required:true,

    },
    state:{
        type:String,
        required:true,
    }
});
const Address=mongoose.model("address",AddressesSchema);

export default Address;