import PARequestsService from "../services/PARequests.service.js";

async function createProductRequest(req, res) {
    const user = req.user;
    try {
          if (!req.files || req.files.length === 0) {
            throw new Error("No files uploaded" );
        }

        const productRequest = await PARequestsService.createProductRequest(user._id, req.body, req.files);
        return res.status(200).send(productRequest);
    } catch (error) {
       
        return res.status(500).send({ error: error.message });
    }
}

async function deleteProductRequest(req,res){
    
    const productId=req.params.id;
    try {
        const productRequest=await PARequestsService.deleteProductRequest(req.user._id,productId);
        return res.status(200).send(productRequest);
        
    } catch (error) {
        return res.status(404).send({ error: error.message })
    }
}

export default{
    createProductRequest,
    deleteProductRequest
}