import wishlistService from "../services/wishlist.service.js"

// Add item to wishlist
export const addItemToWishlist = async (req, res) => {
    try {
        const user = req.user
        const { productId } = req.body

        if (!productId) {
            return res.status(400).json({ error: "Product ID is required" })
        }

        const wishlist = await wishlistService.addToWishlist(user._id, productId)

        return res.status(200).json(wishlist)
    } catch (error) {
        console.error("Error adding item to wishlist:", error.message)
        return res.status(500).json({ error: error.message })
    }
}

// Get user's wishlist
export const getUserWishlist = async (req, res) => {
    try {
        const user = req.user
        const wishlist = await wishlistService.getUserWishlist(user._id);
        return res.status(200).json(wishlist)
    } catch (error) {
        console.error("Error fetching user wishlist:", error.message)
        return res.status(500).json({ error: error.message })
    }
}

// Remove item from wishlist
export const removeItemFromWishlist = async (req, res) => {
    try {
        const wishlistItemId = req.params.id
        const user = req.user;

        if (!wishlistItemId) {
            return res.status(400).json({ error: "Wishlist item ID is required" })
        }

        const wishlistItem = await wishlistService.removeFromWishlist(wishlistItemId, user._id)
        return res.status(200).json(wishlistItem)
    } catch (error) {
        console.error("Error removing item from wishlist:", error.message)
        return res.status(500).json({ error: error.message })
    }
}

export default {
    addItemToWishlist,
    getUserWishlist,
    removeItemFromWishlist,
}