import orderService from "../services/order.service.js";

async function getAllOrders(req,res){

    try {
        const orders=await orderService.getAllOrders();
        return res.status(200).send(orders);
        
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
}

async function deleteOrder(req,res){
    const orderId=req.params.orderId;
    try {
       const orders= await orderService.deleteOrder(orderId);
       return res.status(200).send(orders);

    } catch (error) {
        return res.status(500).send({error:error.message});
    }
}

async function confirmOrder(req,res){
    const orderId=req.params.orderId;
    try {
       const orders= await orderService.confirmOrder(orderId);
       return res.status(200).send(orders);

    } catch (error) {
        return res.status(500).send({error:error.message});
    }
}

async function shippOrder(req,res){
    const orderId=req.params.orderId;
    try {
       const orders= await orderService.shippOrder(orderId);
       return res.status(200).send(orders);

    } catch (error) {
        return res.status(500).send({error:error.message});
    }
}

async function deliverOrder(req,res){
    const orderId=req.params.orderId;
    try {
       const orders= await orderService.deliverOrder(orderId);
       return res.status(200).send(orders);

    } catch (error) {
        return res.status(500).send({error:error.message});
    }
}

async function cancelOrder(req,res){
    const orderId=req.params.orderId;
    try {
       const orders= await orderService.cancelOrder(orderId);
       return res.status(200).send({orders,message:"Admin cancelled the order"});

    } catch (error) {
        return res.status(500).send({error:error.message});
    }
}

export default {
    getAllOrders,
    deleteOrder,
    confirmOrder,
    shippOrder, 
    deliverOrder,
    cancelOrder
}
