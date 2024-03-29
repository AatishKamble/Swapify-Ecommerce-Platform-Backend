import PARequestsService from "../services/PARequests.service.js";


async function createProductRequest(req,res){
    const user=req.user;
    try {
        const productRequest=await PARequestsService.createProductRequest(user._id,req.body);
        return res.status(200).send(productRequest);
        
    } catch (error) {
        return res.status(404).send({ error: error.message })
    }
}


async function deleteProductRequest(req,res){
    const userId=req.user;
    const productId=req.params.id;
    try {
        const productRequest=await PARequestsService.deleteProductRequest(user._id,productId);
        return res.status(200).send(productRequest);
        
    } catch (error) {
        return res.status(404).send({ error: error.message })
    }
}

export default{
    createProductRequest,
    deleteProductRequest
}