import express from "express"
import authenticate from "../middleware/authenticate.js";

import wishlistController from "../controller/wishlist.controller.js"

const router = express.Router()

// Add item to wishlist
router.post("/add", authenticate, wishlistController.addItemToWishlist)

// Get user's wishlist
router.get("/", authenticate, wishlistController.getUserWishlist)

// Remove item from wishlist
router.delete("/wishlist_items/delete/:id", authenticate, wishlistController.removeItemFromWishlist)

export default router;