import cartService from "../services/cart.service.js";


async function getUserCart(req,res){
    const user=req.user;
    try {
       
        const cart =await cartService.getUserCart(user._id);
        return res.status(200).send(cart);
        
    } catch (error) {
     return res.status(500).send({error:error.message});   
    }
}

async function addToCart(req,res){
 const user=req.user;
    try {
       
        const cartItem=await cartService.addToCart(user._id,req.body);
        return res.status(200).send(cartItem);
        
    } catch (error) {
        return res.status(500).send({error:error.message});   
    }
}


export default {
    getUserCart,
    addToCart
 };