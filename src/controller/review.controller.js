import reviewService from "../services/review.service.js"

// Create a new review
async function createReview(req, res) {
  try {
    const userId = req.user._id
    const { productId, rating, comment } = req.body

    // Validate input
    if (!productId || !rating) {
      return res.status(400).json({ error: "Product ID and rating are required" })
    }

    // Check if rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" })
    }

    const review = await reviewService.createReview({
      user: userId,
      product: productId,
      rating,
      comment: comment || "",
    })

    return res.status(201).json(review)
  } catch (error) {
    console.error("Error creating review:", error)
    return res.status(500).json({ error: error.message })
  }
}

// Get reviews for a specific product
async function getProductReviews(req, res) {
  try {
    const { productId } = req.params
    const reviews = await reviewService.getProductReviews(productId)
    return res.status(200).json(reviews)
  } catch (error) {
    console.error("Error getting product reviews:", error)
    return res.status(500).json({ error: error.message })
  }
}

// Get reviews by a specific user
async function getUserReviews(req, res) {
  try {
    const userId = req.user._id
    const reviews = await reviewService.getUserReviews(userId)
    return res.status(200).json(reviews)
  } catch (error) {
    console.error("Error getting user reviews:", error)
    return res.status(500).json({ error: error.message })
  }
}

// Update a review
async function updateReview(req, res) {
  try {
    const userId = req.user._id
    const { reviewId } = req.params
    const { rating, comment } = req.body

    // Validate input
    if (!rating) {
      return res.status(400).json({ error: "Rating is required" })
    }

    // Check if rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" })
    }

    const updatedReview = await reviewService.updateReview(reviewId, userId, {
      rating,
      comment: comment || "",
    })

    return res.status(200).json(updatedReview)
  } catch (error) {
    console.error("Error updating review:", error)
    return res.status(500).json({ error: error.message })
  }
}

// Delete a review
async function deleteReview(req, res) {
  try {
    const userId = req.user._id
    const { reviewId } = req.params

    await reviewService.deleteReview(reviewId, userId)
    return res.status(200).json({ message: "Review deleted successfully" })
  } catch (error) {
    console.error("Error deleting review:", error)
    return res.status(500).json({ error: error.message })
  }
}

export default {
  createReview,
  getProductReviews,
  getUserReviews,
  updateReview,
  deleteReview,
}
