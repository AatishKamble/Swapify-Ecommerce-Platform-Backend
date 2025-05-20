import Address from "../models/address.model.js"
import userService from "../services/user.service.js"
import cartService from "../services/cart.service.js"
import Order from "../models/order.model.js"
import OrderItems from "../models/orderItems.model.js"
import cartItemsService from "./cartItems.service.js"
import Product from "../models/product.model.js" // Import Product model
import Wishlist from "../models/wishlist.model.js" // Import Wishlist model if you have one

async function createOrder(userId, orderData) {
  try {
      // Handle shipping address
      let address
      if (orderData.shippingAddress) {
          if (orderData.shippingAddress._id) {
              // Use existing address
              address = await Address.findById(orderData.shippingAddress._id)
              if (!address) {
                  throw new Error("Address not found with id: " + orderData.shippingAddress._id)
              }
          } else {
              // Create new address
              address = new Address(orderData.shippingAddress)
              address.user = userId
              await address.save()

              // Add address to user's addresses
              const user = await userService.getUserById(userId)
              user.address.push(address)
              await user.save()
          }
      } else {
          throw new Error("Shipping address is required")
      }

      // Initialize order items array
      const orderItems = []

      // Process products based on isDirect flag
      if (orderData.isDirect) {
          if (!orderData.products || orderData.products.length === 0) {
              throw new Error("No products provided for direct purchase")
          }

          // Create order item for the direct product
          for (const productData of orderData.products) {
              // Get the actual product ID (handle different structures)
              const productId = productData._id || (productData.product && productData.product._id) || null

              if (!productId) {
                  throw new Error("Invalid product data: missing product ID")
              }

              // Get the product from database
              const product = await Product.findById(productId)
              if (!product) {
                  throw new Error("Product not found with id: " + productId)
              }

              // Create order item
              const orderItem = new OrderItems({
                  product: productId,
                  price: productData.price || productData.expectedPrice || product.price,
                  quantity: productData.quantity || 1,
                  user: userId,
              })

              const savedOrderItem = await orderItem.save()
              orderItems.push(savedOrderItem)

              // Update product status to Sold
              product.state = "Sold"
              await product.save()

              // Remove from wishlist if exists
              try {
                  await Wishlist.findOneAndDelete({ user: userId, product: productId })
              } catch (error) {
                  console.log("Error removing from wishlist:", error.message)
              }
          }
      } else {
          // Process only the selected cart items sent from frontend
          if (!orderData || !orderData.products || orderData.products.length === 0) {
              throw new Error("No Products selected for order")
          }

          // Process each selected product
          for (const item of orderData.products) {
              // Extract the product ID correctly
              const productId = item.product && typeof item.product === 'object' ? 
                  item.product._id : item.product;

              // Get the product from database to ensure it exists
              const product = await Product.findById(productId)
              if (!product) {
                  throw new Error(`Product not found with id: ${productId}`)
              }

              const orderItem = new OrderItems({
                  product: productId,
                  price: item.price,
                  quantity: item.quantity,
                  user: userId,
              })

              const savedOrderItem = await orderItem.save()
              orderItems.push(savedOrderItem)

              // Update product status to Sold
              product.state = "Sold"
              await product.save()

              // Remove only this specific item from cart
              if (item._id) {
                  await cartItemsService.removeCartItem(userId, item._id)
              }

              // Remove from wishlist if exists
              try {
                  await Wishlist.findOneAndDelete({ user: userId, product: productId })
              } catch (error) {
                  console.log("Error removing from wishlist:", error.message)
              }
          }
      }

      // Create the order with only the selected items
      const newOrder = new Order({
          user: userId,
          orderItems: orderItems,
          shippingAddress: address,
          totalPrice: orderData.totalPrice || orderData.totalAmount || 0,
          totalItems: orderItems.length,
          paymentDetails: {
              paymentMethod: orderData.paymentMethod || "COD",
              paymentStatus: orderData.paymentMethod === "COD" ? "PENDING" : "COMPLETED",
              paymentId: orderData.paymentInfo?.transactionId || null,
              paymentDate: new Date(),
          },
          orderStatus: "PLACED", // Set initial status to PLACED
          createdAt: new Date(),
      })

      const savedOrder = await newOrder.save()

      return savedOrder
  } catch (error) {
      console.error("Error in createOrder service:", error)
      throw new Error(error.message)
  }
}

async function placeOrder(orderId) {
  const order = await getOrderById(orderId)
  order.orderStatus = "PLACED"
  order.paymentDetails.paymentStatus = "COMPLETED"
  return await order.save()
}

async function confirmOrder(orderId) {
  const order = await getOrderById(orderId)
  order.orderStatus = "CONFIRMED"
  return await order.save()
}

async function shippOrder(orderId) {
  const order = await getOrderById(orderId)
  order.orderStatus = "SHIPPED"
  return await order.save()
}

async function deliverOrder(orderId) {
  const order = await getOrderById(orderId)
  order.orderStatus = "DELIVERED"
  return await order.save()
}

async function cancelOrder(orderId) {
  try {
    const order = await getOrderById(orderId)
    
    // Only allow cancellation if order is not delivered or already cancelled
    if (order.orderStatus === "DELIVERED" || order.orderStatus === "CANCELLED") {
      throw new Error(`Cannot cancel order that is already ${order.orderStatus.toLowerCase()}`)
    }
    
    // Update order status
    order.orderStatus = "CANCELLED"
    
    // Mark all products as unsold
    if (order.orderItems && order.orderItems.length > 0) {
      for (const item of order.orderItems) {
        if (item.product && item.product._id) {
          const product = await Product.findById(item.product._id)
          if (product) {
            // Set product state back to(unsold)
            product.state = "Unsold"
            await product.save()
            console.log(`Product ${product._id} marked as unsold`)
          }
        }
      }
    }
    
    // Save the updated order
    const updatedOrder = await order.save()
    return updatedOrder
  } catch (error) {
    console.error("Error cancelling order:", error)
    throw error
  }
}

async function getOrderById(orderId) {
  const order = await Order.findById(orderId)
    .populate("user")
    .populate({ path: "orderItems", populate: { path: "product" } })
    .populate("shippingAddress")

  if (!order) {
    throw new Error("Order not found with id", orderId)
  }
  return order
}

async function userOrderHistory(userId) {
  try {
    const order = await Order.find({ user: userId })
      .populate({ path: "orderItems", populate: { path: "product" } })
      .populate("shippingAddress")
      .sort({ createdAt: -1 })
      .lean()
    return order
  } catch (error) {
    throw new Error(error.message)
  }
}

async function getAllOrders() {
  const order = await Order.find()
    .populate({ path: "orderItems", populate: { path: "product" } })
    .populate("shippingAddress")
    .sort({ createdAt: -1 })
    .lean()
  return order
}

async function deleteOrder(orderId) {
  const order = await getOrderById(orderId)
  const orderItemId = order.orderItems

  for (const item of orderItemId) {
    await OrderItems.findByIdAndDelete(item._id)
  }
  await Order.findByIdAndDelete(orderId)
  return "Order deleted Successfully"
}

export default {
  createOrder,
  placeOrder,
  confirmOrder,
  shippOrder,
  deliverOrder,
  cancelOrder,
  getOrderById,
  userOrderHistory,
  getAllOrders,
  deleteOrder,
}
