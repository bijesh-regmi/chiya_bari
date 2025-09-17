/*TODO: --delete local files when not uploaded to cloudinary
        --better way to check for req.body fields are proper
*/
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
    /**
     * get the user by id
     * generate access and refresh token
     * save the refresh token in the database
     * save the document,  we use { validateBeforeSave: false } here because:
     * - We are only updating a single field (refreshToken).
     * - We don't want to re-run all schema validations (like required fields)
     *   which are already satisfied in the existing document.
     * - This avoids accidental validation errors on fields that may be
     *   optional or unchanged.
     * return the tokens
     */
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        //save the refresh token in the user document
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating access and refresh token"
        );
    }
};

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
        //check if any of the fields are empty
        [username, password, email, fullName]?.some(
            (field) => !field || String(field).trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required.");
    }
    //check if user already exists
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

export const userLogin = asyncHandler(async (req, resp) => {
    //get data from body
    //check username and email
    //check if user exists
    //check password
    //generate access token and refresh token
    //send cookie
    const { email, username, password } = req.body;
    if (!(username || email)) {
        throw new ApiError(400, "email or username is required");
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    //we use document itself and not the schema for accessing instance method
    //here isPasswordCorrect is called on user, a document instance of User schema
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }
    const { accessToken, refreshToken } =
        await generateAccessTokenAndRefreshToken(user._id);
});
