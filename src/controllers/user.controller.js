//TODO: --delete local files when not uploaded to cloudinary

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

export const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    //validation
    //check if user exists: email and username
    //check for images: avatar is required
    //upload to cloudinary
    //create user object- entry in the db
    //check for user creation
    //remove password and refresh token from response
    //return response
    const { username, password, email, fullName } = req.body;
    if (
        [username, password, email, fullName].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required.");
    }
    const existedUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existedUser) throw new ApiError(409, "User already exist");
    /*get the localFilePath of images
    req.files = {
        avatar: [
            {
            fieldname: "avatar",
            encoding: "7bit",
            originalname: "myphoto.png",
            mimetype: "image/png",
            destination: "./public/temp",
            filename: "1694567890-123456789.png",
            path: "public/temp/1694567890-123456789.png",
            size: 12345
            } 
        ]
}*/
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");
    //upload on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    // let coverImage
    // if (coverImageLocalPath) {
    //     coverImage = await uploadOnCloudinary(coverImageLocalPath);
    // }
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!avatar) {
        throw new ApiError(400, "Avatar is required");
    }

    //create user in db
    const user = await User.create({
        username: username.toLowerCase(),
        fullName,
        avatar: avatar.url,
        email,
        password,
        coverImage: coverImage?.url || ""
    });
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if (!createdUser)
        throw new ApiError(
            500,
            "Something went wrong while registering the user."
        );
    return res
        .status(201)
        .json(
            new ApiResponse(200, createdUser, "User registered successfully")
        );
});
