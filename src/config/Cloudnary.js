import { v2 as cloudinary } from 'cloudinary';
import "dotenv/config";
import fs from "fs";


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SCRETE, // Corrected variable name
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

       
        // Replace backslashes with forward slashes for Cloudinary
        const normalizedPath = localFilePath.replace(/\\/g, "/");

        // Uploading file to Cloudinary
        const response = await cloudinary.uploader.upload(normalizedPath, {
            resource_type: "auto"
        });

       
        // Delete local file after successful upload
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
       
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
};

const deleteFromCloudinary=async(publicId)=>{
try {
    const result=await cloudinary.uploader.destroy(publicId);

    return result;
} catch (error) {
    throw new Error(error.message);
}

}

export {uploadOnCloudinary,deleteFromCloudinary};