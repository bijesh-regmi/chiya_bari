/*TODO: --delete local files when not uploaded to cloudinary
        --better way to check for req.body fields are proper
*/
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
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

export const userLogin = asyncHandler(async (req, res) => {
    //get data from body
    //check username and email
    //check if user exists
    //check password
    //generate access token and refresh token
    //send cookie
    if (!req.body || Object.keys(req.body).length === 0) {
        throw new ApiError(400, "Request body cannot be empty");
    }
    const { email, username, password } = req.body;
    if (!(username && email)) {
        //makes sure both email and username are truthy
        throw new ApiError(400, "email and username is required");
    }
    if (!password) throw new ApiError(400, "Please enter your password.");
    const user = await User.findOne({ $and: [{ username }, { email }] });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    //we use document itself and not the schema for accessing instance method
    //here isPasswordCorrect is called on user, a document instance of User schema
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }
    //prettier-ignore
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    //since the reference to the user is not outdated i.e empty so we need to have another db call to get the user
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    //when sending cookie, we need options
    const options = {
        httpOnly: true,
        secure: true
    };
    // set access token cookie
    // options={
    //   httpOnly: true,       prevents client-side JS from reading the cookie
    //   secure: true,         cookie only sent over HTTPS
    //   sameSite: "strict",   CSRF protection
    //   maxAge: 15 * 60 * 1000 15 minutes
    // });
    return (
        res
            .status(200)
            //in resp use "cookie" for single cookie
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        //sent tokens in case user want to set their own cookie eg in localstorage only
                        user: loggedInUser,
                        refreshToken,
                        accessToken
                    },
                    "User loggedIn Successfully"
                )
            )
    );
});

export const userLogOut = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    await User.findByIdAndUpdate(
        userId,
        { $unset: { refreshToken: "" } },
        { new: true }
    );
    const options = {
        httpOnly: true,
        secure: true
    };
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
    //take from req.body in case the req is from mobile app
    //prettier-ignore
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
        if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized request");
    
        
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET_KEY
        );
        if (!decodedToken) throw new ApiError(401, "Invalid Refresh Token");
    
    
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        );
        if (!user) throw new ApiError(401, "Token Invalid");
    
        if(incomingRefreshToken !== user?.refreshToken) throw new ApiError(401, "Invalid request's refresh token, expired  or used");

        const { newAccessToken, newRefreshToken } = await generateAccessTokenAndRefreshToken(user._id);

        user.refreshToken = newRefreshToken;
        await user.save({validateBeforeSave:false })

        const options={
            httpOnly: true,
            secure:true
        }

        res.status(200)
            .cookie("accessToken", newAccessToken,options)
            .cookie("refreshToken", newRefreshToken,options)
            .json(new ApiResponse(200, {},"Access token refresh successful."));
    } catch (error) {
        throw new ApiError(500, error?.message || "Something we wrong while refreshing token")
    }
});

export const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const user = await User.findById(req.user?._id);

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) throw new ApiError(400, "Invalid old password");

    if (newPassword !== confirmPassword)
        throw new ApiError(400, "Password did not match");

    user.password = newPassword;

    await user.save({ validateBeforeSave: false });

    return (
        res.status(200),
        json(new ApiResponse(200, {}, "Password change successful"))
    );
});

export const getCurrentUse = asyncHandler(async (req, res) => {
    res.status(200).json(
        new ApiResponse(200, req.user, "Fetch current user successful")
    );
});
