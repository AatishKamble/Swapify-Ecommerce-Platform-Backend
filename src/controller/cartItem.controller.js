import cartItemService from "../services/cartItems.service.js";

async function updateCartItem(req ,res){
        const user=req.user;
    try {
    
        const updatedCartItem=await cartItemService.updateCartItem(user._id,req.params.id,req.body);
        return res.status(200).send(updatedCartItem);
        
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
}

async function removeCartItem(req,res){
    const user=req.user;
    try {
        const removeItem=await cartItemService.removeCartItem(user._id,req.params.id);
        return res.status(200).send(removeItem);
        
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
}

export default {
    updateCartItem,
    removeCartItem
}