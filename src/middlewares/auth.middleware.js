import jwt, { decode } from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    //#For req we use "cookies" plural to get all the cookies
    // synchronous errors (like jwt.verify) still need try...catch
    try {
        //prettier-ignore
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) throw new ApiError(401, "Unauthorized Request");
        try {
            const decodedToken = jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET_KEY
            );
        } catch (error) {
            throw new ApiError(401, "Invalid or expired access token")
            
        }

        const user = await User.findById(decodedToken._id);
        if (!user) throw new ApiError(401, "User not found or Invalid Access Token");
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access token");
    }
});
