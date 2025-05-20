import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    wishlistItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "wishlistItems",
    }],
    totalItems: {
        type: Number,
        required: true,
        default: 0,
    }
});

const Wishlist = mongoose.model("wishlist", wishlistSchema);

export default Wishlist;