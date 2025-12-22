import { v2 as cloudinary } from "cloudinary";
export const generateThumbnailCloudinary = async (public_id) => {
    try {
        if (!public_id) return null;
        return cloudinary.url(public_id, {
            resource_type: "video",
            format: "webp",
            transformation: [
                { start_offset: "auto" },
                {
                    width: 1280,
                    height: 720,
                    crop: "fill"
                }
            ]
        });
    } catch (error) {
        console.log("Unable to generate thumbnail");
    }
};
export const generateThumbnailFfmpeg = async (video_path) => {
    video_path;
};
