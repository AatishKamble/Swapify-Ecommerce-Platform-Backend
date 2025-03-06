
import { uploadOnCloudinary } from "../config/Cloudnary.js";
import PARequestsService from "../services/PARequests.service.js";


async function getAllProductRequests(req, res) {
    try {
        const PARequest = await PARequestsService.getAllProductRequests(req.params.id);
        return res.status(200).send(PARequest);
    } catch (error) {
        return res.status(404).send({ error: error.message })
    }
}



async function findProductByProductRequestId(req, res) {
    const productId = req.params.id;
    try {
        const product = await PARequestsService.findProductByProductRequestId(productId);
        return res.status(201).send(product);

    } catch (error) {
        return res.status(404).send({ error: error.message });
    }
}

async function approveProductRequest(req, res) {
    const productId = req.params.id;
    try {
        const product = await PARequestsService.approveProductRequest(productId);
        return res.status(201).send(product);

    } catch (error) {
        return res.status(404).send({ error: error.message });
    }
}
async function rejectProductRequest(req, res) {
    const productId = req.params.id;
    try {
        const product = await PARequestsService.rejectProductRequest(productId);
        return res.status(201).send(product);

    } catch (error) {
        return res.status(404).send({ error: error.message });
    }
}


async function findProductReq(req, res) {
    try {
       
        const PARequest = await PARequestsService.findProductReq(req.user?._id);
       
        return res.status(200).send(PARequest);
    } catch (error) {
       
        return res.status(404).send({ error: error.message })
    }
}





export default {
    getAllProductRequests,
    findProductByProductRequestId,
    approveProductRequest,
    rejectProductRequest,
    findProductReq,


}

