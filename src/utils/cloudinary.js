import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Set up Cloudinary configuration
// config() returns a global config object which is populated by the following information
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Function to upload a file to Cloudinary
export const uploadOnCloudinary = async (localFilePath) => {
    console.log("cloudinary upload called>>>!");
    try {
        if (!localFilePath) return "Local File Path Not Found!!";
        // Upload file to Cloudinary
        // Uses the global config object implicitly for credentials
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto" // Automatically detect the file type (image, video, etc.)
        });
        fs.unlinkSync(localFilePath);
        console.log(`File is uploaded successfully on: ${response.url}`);
        return response;
    } catch (err) {
        console.error("Error uploading file to Cloudinary:", err);
        //when uploading fails, the local files are to be deleted as those file may be corrupted, malicious and they might pileup taking alot of space
        fs.unlinkSync(localFilePath); //unlink is deleting the file with sync as it need to happen before moving on
    }
};
export const deleteCloudinary = async (publicId) => {
    try {
        if (!publicId) return "image id not valid";

        const response = await cloudinary.uploader.destroy(publicId);
        console.log(response);
        return response;
    } catch (error) {
        console.error("Error while deleting file in cloudinary");
    }
};
