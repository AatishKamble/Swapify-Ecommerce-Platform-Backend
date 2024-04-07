import CartItem from "../models/cartItems.model.js";
import userService from "../services/user.service.js";

import Cart from "../models/cart.model.js";
const getCartItemById = async (cartItemId) => {
    try {
        const cartItem = await CartItem.findById(cartItemId).populate("product");
        if (!cartItem) {
            throw new Error("Cart item not found with id", cartItemId);
        }
        return cartItem;

    } catch (error) {
        throw new Error(error.message);
    }
}

const updateCartItem = async (userId, cartItemId, newCartItemData) => {
        try {
            const cartItem = await getCartItemById(cartItemId);

            if (!cartItem) {
                throw new Error("Cart Item not found" + cartItemId);
            }

            const user = await userService.getUserById(cartItem.user);
            if (!user) {
                throw new Error("user not found " + userId);
            }
            if (user._id.toString() === userId.toString()) {
                cartItem.quantity = newCartItemData.quantity,

                    cartItem.price = cartItem.quantity * cartItem.product.price;
                const updatedCartItem = await cartItem.save();
                return updatedCartItem;
            }
            else {
                throw new Error("You can't updated Item with id", cartItemId);
            }


        } catch (error) {
            throw new Error(error.message);
        }

    }

const removeCartItem = async (userId, cartItemId) => {
    try {
        const item = await getCartItemById(cartItemId);
        if (!item) {
            throw new Error("Cart Item not found", cartItemId);
        }
        const user = await userService.getUserById(item.user);
        if (!user) {
            throw new Error("user not found", userId);
        }
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            throw new Error("cart not found for ", userId);
        }
        if (user._id.toString() === userId.toString()) {
            await CartItem.findByIdAndDelete(item._id);
            
            cart.cartItems=cart.cartItems.filter(cartItemId => cartItemId.toString() !== item._id.toString())
            await cart.save();
            return item;
        }

    } catch (error) {
        throw new Error(error.message);
    }

}



export default {
    getCartItemById,
    updateCartItem,
    removeCartItem
}