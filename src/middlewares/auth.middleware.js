import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

const authMiddleware = asyncHandler(async (req, res, next) => {
    const accessToken =
        req.cookies?.accessToken ||
        req.headers?.authorization?.startsWith("Bearer ")
            ? req.headers.authorization.split(" ")[1]
            : null;

    if (!accessToken) {
        throw new ApiError(401, "Unauthorized access");
    }

    let decodedToken;

    try {
        decodedToken = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET_KEY
        );
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Access token expired");
        }
        throw new ApiError(401, "Invalid access token");
    }

    const user = await User.findById(decodedToken._id).select(
        "-password -refreshToken"
    );

    if (!user) {
        throw new ApiError(401, "User not found");
    }

    req.user = user;
    next();
});

export default authMiddleware;
