import Wishlist from "../models/wishlist.model.js"
import WishlistItem from "../models/wishlistItem.model.js"
import Product from "../models/product.model.js"

// Add item to wishlist
const addToWishlist = async (userId, productId) => {
    try {
        // Check if product exists
        const product = await Product.findById(productId)
        if (!product) {
            throw new Error("Product not found")
        }

        // Find user's wishlist or create a new one
        let wishlist = await Wishlist.findOne({ user: userId })

        if (!wishlist) {
            wishlist = new Wishlist({
                user: userId,
                wishlistItems: [],
                totalItems: 0,
            })
            await wishlist.save()
        }

        // Check if product is already in wishlist
        const existingWishlistItem = await WishlistItem.findOne({
            wishlist: wishlist._id,
            product: productId,
            user: userId,
        })

        if (existingWishlistItem) {
            // If product is already in wishlist, remove it (toggle behavior)
            await WishlistItem.findByIdAndDelete(existingWishlistItem._id)

            // Update wishlist
            wishlist.wishlistItems = wishlist.wishlistItems.filter(
                (item) => item.toString() !== existingWishlistItem._id.toString(),
            )
            wishlist.totalItems = wishlist.wishlistItems.length
            await wishlist.save()

            // Return updated wishlist
            return await populateWishlist(wishlist._id)
        }

        // Create new wishlist item
        const wishlistItem = new WishlistItem({
            wishlist: wishlist._id,
            product: productId,
            user: userId,
        })
        await wishlistItem.save()

        // Update wishlist
        wishlist.wishlistItems.push(wishlistItem._id)
        wishlist.totalItems = wishlist.wishlistItems.length
        await wishlist.save()

        // Return updated wishlist
        return await populateWishlist(wishlist._id)
    } catch (error) {
        console.error("Error in addToWishlist service:", error.message)
        throw new Error(error.message)
    }
}

// Get user's wishlist
const getUserWishlist = async (userId) => {
    try {
        // Find user's wishlist
        let wishlist = await Wishlist.findOne({ user: userId })

        if (!wishlist) {
        // If no wishlist exists, create an empty one
            wishlist = new Wishlist({
                user: userId,
                wishlistItems: [],
                totalItems: 0,
            })
            await wishlist.save()
        }

        // Return populated wishlist
        return await populateWishlist(wishlist._id)
    } catch (error) {
        console.error("Error in getUserWishlist service:", error.message)
        throw new Error(error.message)
    }
}

// Remove item from wishlist
const removeFromWishlist = async (wishlistItemId, userId) => {
    try {
        // Find and verify wishlist item
        const wishlistItem = await WishlistItem.findById(wishlistItemId)

        if (!wishlistItem) {
            throw new Error("Wishlist item not found")
        }

        // Find user's wishlist
        const wishlist = await Wishlist.findOne({
            _id: wishlistItem.wishlist,
            user: userId,
        })

        if (!wishlist) {
            throw new Error("Wishlist not found or unauthorized")
        }

        // Remove wishlist item
        await WishlistItem.findByIdAndDelete(wishlistItemId)

        // Update wishlist
        wishlist.wishlistItems = wishlist.wishlistItems.filter((item) => item.toString() !== wishlistItemId.toString())
        wishlist.totalItems = wishlist.wishlistItems.length
        await wishlist.save()

        return wishlistItem
    } catch (error) {
        console.error("Error in removeFromWishlist service:", error.message)
        throw new Error(error.message)
    }
}

// Helper function to populate wishlist with product details
const populateWishlist = async (wishlistId) => {
    return await Wishlist.findById(wishlistId).populate({
        path: "wishlistItems",
        populate: {
            path: "product",
            select: "title price imageURL description category",
        },
    })
}

export default {
    addToWishlist,
    getUserWishlist,
    removeFromWishlist,
}