import { uploadOnCloudinary } from "../config/Cloudnary.js";
import PARequestsService from "../services/PARequests.service.js";


async function getAllProductRequests(req, res) {
    try {
        const PARequesyt = await PARequestsService.getAllProductRequests();
        return res.status(200).send(PARequesyt);
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

// Get product request statistics
async function getProductRequestStats(req, res) {
    try {
        // Get count of pending requests
        const pendingRequests = await PARequestsService.countRequestsByStatus("sellrequest")
    
        // Get count of total products
        const totalProducts = await PARequestsService.countTotalProducts()
    
        // Get count of active sellers
        const activeSellers = await PARequestsService.countActiveSellers()
    
        return res.status(200).send({
            pendingRequests,
            totalProducts,
            activeSellers,
        })
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

async function acceptCancelRequest(req, res) {
    const productId = req.params.id;
    try {
        const product = await PARequestsService.acceptCancelRequest(productId);
        return res.status(201).send(product);

    } catch (error) {
        return res.status(404).send({ error: error.message });
    }
}

async function rejectCancelRequest(req, res) {
    const productId = req.params.id;
    try {
        const product = await PARequestsService.rejectCancelRequest(productId);
        return res.status(201).send(product);

    } catch (error) {
        return res.status(404).send({ error: error.message });
    }
}

export default {
    getAllProductRequests,
    findProductByProductRequestId,
    approveProductRequest,
    rejectProductRequest,
    findProductReq,
    getProductRequestStats,
    acceptCancelRequest,
    rejectCancelRequest,
}
