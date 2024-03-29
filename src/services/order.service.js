import Address from "../models/address.model.js";
import userService from "../services/user.service.js";
import cartService from "../services/cart.service.js";
import Order from "../models/order.model.js";
import OrderItems from "../models/orderItems.model.js";
import cartItemsService from "./cartItems.service.js";
async function createOrder(userId, shippingAddress) {
    try {
        let address;
        if (shippingAddress._id) {
            let existsAddress = await Address.findById(shippingAddress._id);
            address = existsAddress;

        }
        else {
            address = new Address(shippingAddress);
            address.user = userId;
            await address.save();
            const user = await userService.getUserById(userId);
            user.address.push(address);
            await user.save();
        }
        const cart = await cartService.getUserCart(userId);
        const orderItems = [];
        for (let item of cart.cartItems) {
            const orderItem = new OrderItems({
                product: item.product,
                price: item.price,
                quantity: item.quantity,
                user: item.user

            })

            const createdOrderItem = await orderItem.save();
            orderItems.push(createdOrderItem);
           console.log(cart.user);
           await cartItemsService.removeCartItem(cart.user,item._id);

        }

        const newOrder = new Order({
            user: userId,
            orderItems: orderItems,
            shippingAddress: address,
            totalPrice: cart.totalPrice,
            totalItems: cart.totalItems

        });

        const savedOrder = await newOrder.save();

        return savedOrder;

    } catch (error) {
        throw new Error(error.message);
    }
}

async function placeOrder(orderId) {
    const order = await getOrderById(orderId);

    order.orderStatus = "PLACED";
    order.paymentDetails.paymentStatus = "COMPLETED";
    
    return await order.save();
}

async function confirmOrder(orderId) {
    const order = await getOrderById(orderId);

    order.orderStatus = "CONFIRMED";
    return await order.save();
}
async function shippOrder(orderId) {
    const order = await getOrderById(orderId);

    order.orderStatus = "SHIPPED";
    return await order.save();
}
async function deliverOrder(orderId) {
    const order = await getOrderById(orderId);

    order.orderStatus = "DELIVERED";
    return await order.save();
}
async function cancelOrder(orderId) {
    const order = await getOrderById(orderId);

    order.orderStatus = "CANCELLED";
    return await order.save();
}

async function getOrderById(orderId) {
    const order = await Order.findById(orderId)
        .populate("user")
        .populate({ path: "orderItems", populate: { path: "product" } })
        .populate("shippingAddress");

    if (!order) {
        throw new Error("Order not found with id", orderId);
    }
    return order;

}

async function userOrderHistory(userId) {
    try {
     
        const order = await Order.find({user:userId,orderStatus: "PLACED" }).populate({ path: "orderItems", populate: { path: "product" } }).lean();
      
        return order;

    } catch (error) {
        throw new Error(error.message);
    }
}

async function getAllOrders() {
    const order = await Order.find()
        .populate({ path: "orderItems", populate: { path: "product" } }).lean();
    return order;
}

async function deleteOrder(orderId) {
    const order=await getOrderById(orderId);
    const orderItemId=order.orderItems;
    
    for(let item of orderItemId){
     await OrderItems.findByIdAndDelete(item._id);
      
    }
    await Order.findByIdAndDelete(orderId);
    return "Order deleted Successfully";
}

export default{
createOrder,
placeOrder,
confirmOrder,
shippOrder,
deliverOrder,
cancelOrder,
getOrderById,
userOrderHistory,
getAllOrders,
deleteOrder
}
