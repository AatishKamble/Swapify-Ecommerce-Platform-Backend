import express from "express"
import reviewController from "../controller/review.controller.js"
import authenticate from "../middleware/authenticate.js"

const router = express.Router()

// Create a new review
router.post("/create", authenticate, reviewController.createReview)

// Get reviews for a specific product
router.get("/product/:productId", reviewController.getProductReviews)

// Get reviews by a specific user
router.get("/user", authenticate, reviewController.getUserReviews)

// Update a review
router.put("/:reviewId", authenticate, reviewController.updateReview)

// Delete a review
router.delete("/:reviewId", authenticate, reviewController.deleteReview)

export default router