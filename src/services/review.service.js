import Review from "../models/review.model.js"
import Product from "../models/product.model.js" // Assuming you have a Product model

// Create a new review
async function createReview(reviewData) {
  try {
    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      user: reviewData.user,
      product: reviewData.product,
    })

    if (existingReview) {
      throw new Error("You have already reviewed this product")
    }

    // Create the review
    const review = new Review(reviewData)
    await review.save()

    // Update product's average rating
    await updateProductRating(reviewData.product)

    // Return the populated review
    return await Review.findById(review._id)
      .populate("user", "firstName lastName email profilePicture")
      .populate("product", "title price imageURL")
  } catch (error) {
    throw new Error(`Failed to create review: ${error.message}`)
  }
}

// Get reviews for a specific product
async function getProductReviews(productId) {
  try {
    const reviews = await Review.find({ product: productId })
      .populate("user", "firstName lastName email profilePicture")
      .sort({ createdAt: -1 })

    return reviews
  } catch (error) {
    throw new Error(`Failed to get product reviews: ${error.message}`)
  }
}

// Get reviews by a specific user
async function getUserReviews(userId) {
  try {
    const reviews = await Review.find({ user: userId })
      .populate("product", "title price imageURL")
      .sort({ createdAt: -1 })

    return reviews
  } catch (error) {
    throw new Error(`Failed to get user reviews: ${error.message}`)
  }
}

// Update a review
async function updateReview(reviewId, userId, updateData) {
  try {
    // Find the review and check if it belongs to the user
    const review = await Review.findById(reviewId)

    if (!review) {
      throw new Error("Review not found")
    }

    if (review.user.toString() !== userId.toString()) {
      throw new Error("You can only update your own reviews")
    }

    // Update the review
    review.rating = updateData.rating
    review.comment = updateData.comment
    await review.save()

    // Update product's average rating
    await updateProductRating(review.product)

    // Return the updated review
    return await Review.findById(reviewId)
      .populate("user", "firstName lastName email profilePicture")
      .populate("product", "title price imageURL")
  } catch (error) {
    throw new Error(`Failed to update review: ${error.message}`)
  }
}

// Delete a review
async function deleteReview(reviewId, userId) {
  try {
    // Find the review and check if it belongs to the user
    const review = await Review.findById(reviewId)

    if (!review) {
      throw new Error("Review not found")
    }

    if (review.user.toString() !== userId.toString()) {
      throw new Error("You can only delete your own reviews")
    }

    // Store the product ID before deleting the review
    const productId = review.product

    // Delete the review
    await Review.findByIdAndDelete(reviewId)

    // Update product's average rating
    await updateProductRating(productId)

    return true
  } catch (error) {
    throw new Error(`Failed to delete review: ${error.message}`)
  }
}

// Helper function to update a product's average rating
async function updateProductRating(productId) {
  try {
    // Calculate the average rating
    const result = await Review.aggregate([
      { $match: { product: productId } },
      { $group: { _id: "$product", averageRating: { $avg: "$rating" }, count: { $sum: 1 } } },
    ])

    let averageRating = 0
    let reviewCount = 0

    if (result.length > 0) {
      averageRating = result[0].averageRating
      reviewCount = result[0].count
    }

    // Update the product with the new average rating
    await Product.findByIdAndUpdate(productId, {
      averageRating: Number.parseFloat(averageRating.toFixed(1)),
      reviewCount,
    })
  } catch (error) {
    console.error("Error updating product rating:", error)
    // Don't throw here to prevent the main function from failing
  }
}

export default {
  createReview,
  getProductReviews,
  getUserReviews,
  updateReview,
  deleteReview,
}
