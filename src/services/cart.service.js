
import Cart from "../models/cart.model.js";
import CartItem from "../models/cartItems.model.js";
import productService from "../services/product.service.js";
async function createCart(user) {
    try {
        const cart = new Cart({ user });
        const createdCart = await cart.save();
        return createdCart;

    } catch (error) {
        throw new Error(error.message);
    }
}

async function getUserCart(userId) {

    try {
       
        const cart = await Cart.findOne({ user: userId }).populate("cartItems");
       
        let cartItems = await CartItem.find({ cart: cart._id }).populate("product");
       
        cart.cartItems = cartItems;

        let totalPrice = 0;
        let totalItems = 0;

        for (let item of cart.cartItems) {
            totalPrice += item.price;
            totalItems += item.quantity;
        }

        cart.totalPrice = totalPrice;
        cart.totalItems = totalItems;
        return cart;


    } catch (error) {
        throw new Error(error.message);
    }
}

const addToCart = async (userId,reqData) => {

    try {
        const cart = await Cart.findOne({ user: userId });
        if(!cart){
            throw new Error ("Cart not found",userId)
        }
        const product=await productService.findProductById(reqData.productId);
    
        const isPresent=await CartItem.findOne({cart:cart._id,product:product._id,user:userId});
       
        if(!isPresent){
          
            const cartItem=new CartItem({
                cart:cart._id,
                product:product._id,
                price:product.price,
                quantity:1,
                user:userId
            });
           const createdCart=await cartItem.save();
            cart.cartItems.push(createdCart);
            
            await cart.save();
          
        }
        return cart;

    } catch (error) {
        throw new Error(error.message);
    }

}



export default { createCart,getUserCart,addToCart };