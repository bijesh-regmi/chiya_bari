import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {
    generateThumbnailClkoudinary,
    generateThumbnailFfmpeg
} from "../utils/generateThumbnail.js";
import isValidUrl from "../utils/isValidURL.js";

export const uploadVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title.trim()) throw new ApiError(400, "Title is required");
    //get the local path of files
    const videoPath = req.files?.videoFile?.[0].path;
    const thumbnailPath = req.files?.thumbnail?.[0].path;

    if (!videoPath) throw new ApiError(400, "Video required");
    // const video = await uploadOnCloudinary(videoPath);
    // if (!thumbnailPath) {
    //     //generate thumbnail using ffmpeg
    //     let thumbnail = await generateThumbnailClkoudinary(video.public_id);
    //     if (!thumbnail || !isValidUrl(thumbnail)) {
    //         thumbnail = await generateThumbnailFfmpeg(video);
    //     }
    // }

    const [video, thumbnail] = await Promise.all([
        uploadOnCloudinary(videoPath),
        uploadOnCloudinary(thumbnailPath)
    ]);

    if (!video.secure_url || !video.public_id)
        throw new ApiError(500, "Video upload to cloudinary failed!");
    if (!thumbnail.secure_url || !thumbnail.public_id)
        throw new ApiError(500, "Thumbnail upload to cloudinary failed!");

    const newVideo = await Video.create({
        videoFile: video?.secure_url,
        thumbnail: thumbnail.secure_url,
        title,
        videoPublicId: video.public_id,
        thumbnailPublicId: thumbnail.public_id,
        description: description?.trim() || "",
        duration: String(video?.duration),
        owner: req?.user?._id
    });

    const videoResponse = newVideo.toObject();
    delete videoResponse.publicId;

    res.status(201).json(
        new ApiResponse(201, videoResponse, "Video upload successful!")
    );
});

export const getAllVideo = asyncHandler(async (req, res) => {});
