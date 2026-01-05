import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { deleteCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import {
    generateThumbnailCloudinary,
    generateThumbnailFfmpeg
} from "../utils/generateThumbnail.js";
import isValidUrl from "../utils/isValidURL.js";
import mongoose, { isValidObjectId } from "mongoose";

export const uploadVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const videoPath = req.files?.videoFile?.[0].path;
    const thumbnailPath = req.files?.thumbnail?.[0].path;

    if (!title.trim()) throw new ApiError(400, "Title is required");
    if (!(videoPath && thumbnailPath))
        throw new ApiError(400, "Video required");

    // const video = await uploadOnCloudinary(videoPath);
    // if (!thumbnailPath) {
    //     //generate thumbnail using ffmpeg
    //     let thumbnail = await generateThumbnailCloudinary(video.public_id);
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

export const getAllVideo = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortType = "desc",
        userId
    } = req.query;

    let pageNumber = parseInt(page) || 1;
    let limitNumber = parseInt(limit) || 10;
    let skip = limitNumber * (pageNumber - 1);

    if (!req.user) throw new ApiError(400, "User is not logged in.");
    if (!isValidObjectId(userId))
        throw new ApiError(400, "Invalid query, userId is not valid string");

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(400, "User not found");
    }

    let match = {
        ...{ owner: mongoose.Types.ObjectId(userId) }
    };

    if (req.user?._id === userId) {
        match.isPublished = true;
    }

    const videoList = await Video.aggregate([
        {
            $match: match
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $unwind: "$owner" // $unwind is used to flatten the array as the result of lookup is array
        },
        {
            $sort: {
                [sortBy]: sortType === "asc" ? 1 : -1
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limitNumber
        },
        {
            $project: {
                title: 1,
                thumbnail: 1,
                views: 1,
                owner: {
                    username: "$owner.username",
                    fullName: "$owner.fullName",
                    avatar: "$owner.avatar",
                    subscribers:"$owner.subscribers"
                },
                description: 1,
                duration: 1
            }
        }
    ]);
    if (!videoList?.length) throw new ApiError(404, "No video found");
    return res
        .status(200)
        .json(new ApiResponse(200, videoList, "Videos fetched successfully"));
});

export const getVideoById = asyncHandler(async (req, res) => {
    //Logging in is required to view a video
    const { videoId } = req.params;
    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");

    const video = await Video.findByIdAndUpdate(videoId).populate(
        "owner",
        "fullName username"
    );

    if (!video) throw new ApiError(404, "Video not found");
    await Video.findByIdAndUpdate(videoId, {
        $inc: { views: 1 }
    });
    await video.save();
    const user = await User.findById(req?.user?._id);
    if (user) {
        user.watchHistory = user.watchHistory.filter((id) => {
            id.toString() !== video._id.toString();
        });
        user.watchHistory.unshift(video._id);
        await user.save();
    }
    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video fetched successfully"));
});

export const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    let updateData = {};
    if (typeof title === "string" && title.trim()) updateData.title = title;
    if (typeof description === "string" && description.trim())
        updateData.description = description;

    //check for incomming file as thumbnail is not mandetory
    if (req.file) {
        const thumbnailPath = req.file.path;
        if (!thumbnailPath) {
            throw new ApiError(400, "Thumbnail file is missing");
        }
        const thumbnail = await uploadOnCloudinary(thumbnailPath);
        if (!thumbnail.secure_url) {
            throw new ApiError(400, "Error while uploading thumbnail");
        }
        updateData.thumbnail = thumbnail.secure_url;
    }

    //Makes sure there is at least something to update
    if (Object.keys(updateData).length === 0) {
        throw new ApiError(400, "Nothing to update");
    }

    const updatedVideo = await Video.findOneAndUpdate(
        { _id: videoId, owner: req.user._id },
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!updatedVideo) {
        throw new ApiError(
            404,
            "Update failed, unauthorized or video not found"
        );
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedVideo, "Video updat successful"));
});

export const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!(videoId.trim() && isValidObjectId(videoId)))
        throw new ApiError(400, "Invalid video id");

    const video = await Video.findOneAndDelete({
        _id: videoId,
        owner: req?.user?._id
    });
    if (!video) throw new ApiError(404, "Unauthorized or video not found");

    if (video.videoPublicId) await deleteCloudinary(video.videoPublicId);

    if (video.thumbnailPublicId)
        await deleteCloudinary(video.thumbnailPublicId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

export const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!(videoId.trim() && isValidObjectId(videoId)))
        throw new ApiError(400, "Invalid video id");

    const video = await Video.findOne({
        _id: videoId,
        owner: req?.user?._id
    });
    if (!video) throw new ApiError(404, "Unauthorized or video not found");

    video.isPublished = !video.isPublished;
    await video.save();
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Status toggled successfully"));
});
