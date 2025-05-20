import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    mobileNumber: {
        type: String,
        default: "",
    },
    gender: {
        type: String,
        enum: ["male", "female", ""],
        default: "",
    },
    birthDate: {
        type: Date,
        default: null,
    },
    address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "address"
    }],
    paymentInformation: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "payment_information"
    }],
    productRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "productApprovalRequests"
    }]
});

const User = mongoose.model("users", userSchema);

export default User;