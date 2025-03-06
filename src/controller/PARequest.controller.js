
import { uploadOnCloudinary } from "../config/Cloudnary.js";
import PARequestsService from "../services/PARequests.service.js";


async function getAllProductRequests(req, res) {
    try {
        const PARequest = await PARequestsService.getAllProductRequests(req.query);
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
        const PARequest = await PARequestsService.findProductReq(req.params.id);
        return res.status(200).send(PARequest);
    } catch (error) {
        return res.status(404).send({ error: error.message })
    }
}



const uploadImage = async (req, res) => {

    try {

        const userId = req.user._id;
        const files = req.files.length > 0 && req.files;
        let filesUrl = [];
        //for storing multiple images on cloudinary
        for(const file of files){
            const uploadedImage=await uploadOnCloudinary(file.path);
            if(uploadedImage){
                filesUrl.push({
                imageUrl:uploadedImage?.secure_url,
                publicId:uploadedImage?.public_id
            });
            }
            else{
                throw new Error("Not Uploaded on Cloudinary")
            }
            

        }
       
        
        const service = await PARequestsService.uploadImage(userId,filesUrl);
        return res.json({ success: true, message:'Images uploaded Successfully', product: service });
    } catch (error) {

        return res.json({ success: false, message: error.message });
    }



}


export default {
    getAllProductRequests,
    findProductByProductRequestId,
    approveProductRequest,
    rejectProductRequest,
    findProductReq,
    uploadImage

}

