import { Router } from "express";
import {
    getCurrentUse,
    refreshAccessToken,
    registerUser,
    userLogin,
    userLogOut,
    updateAccoutnDetails,
    updateCoverImage,
    getUserChannelProfile
} from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();
router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser
);
router.route("/login").post(userLogin);
//secured routes
router.route("/logout").post(authenticate, userLogOut);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/get-current-user").post(authenticate, getCurrentUse);
router.route("/update-account").patch(authenticate, updateAccoutnDetails);
router
    .route("/avatar")
    .patch( authenticate, upload.single({ name: "avatar" }), updateCoverImage);
router
    .route("/cover-image")
    .patch(
        authenticate,
        upload.single({ name: "coverImage" }),
        updateCoverImage
    );
router.route("/channel/:username").get(authenticate, getUserChannelProfile);

export default router;
