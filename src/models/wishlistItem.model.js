import mongoose from "mongoose"

const wishlistItemSchema = new mongoose.Schema({
    wishlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "wishlist",
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    }
});

const WishlistItem = mongoose.model("wishlistItems", wishlistItemSchema);

export default WishlistItem;