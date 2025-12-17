import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


cloudinary.config(
    { 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    }
);

const uploadOnCloudinary = async (localFilePath) => {   
    try {
        if (!localFilePath) return console.log(" \n file upload FAILED"); 
        const response = await cloudinary.uploader.upload( localFilePath, { resource_type: "auto" } );    //upload the file on cloudinary
        console.log("file is uploaded successfull", response.url);          // file has been uploaded successfull
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath);     // remove the locally saved file as the upload opration got failed
        return null;
    }
}

export {uploadOnCloudinary};