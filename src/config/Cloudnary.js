import { v2 as cloudinary } from 'cloudinary';
import "dotenv/config";
import fs from "fs";

cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret:process.env.CLOUDINARY_API_SCRETE
});


const uploadOnCloudinary=async(localFilePath)=>{
    try {
        if(!localFilePath) return null;
        //uploading file on cloudinary
        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        });
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
    }
}


const deleteFromCloudinary=async(publicId)=>{
try {
    const result=await cloudinary.uploader.destroy(publicId);

    return result;
} catch (error) {
    throw new Error(error.message);
}

}

export {uploadOnCloudinary,deleteFromCloudinary};