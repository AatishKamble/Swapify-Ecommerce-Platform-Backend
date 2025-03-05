import mongoose from "mongoose";

const AddressesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    street: {
        type: String,
        required: true
    },
    village: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: Number,
        required: true
    }
});

const Address = mongoose.model("address", AddressesSchema);

export default Address;
