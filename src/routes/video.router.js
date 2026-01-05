import { Router } from "express";
import {
    getAllVideo,
    uploadVideo,
    getVideoById,
    deleteVideo,
    updateVideo,
    togglePublishStatus
} from "../controllers/video.controller.js";
import upload from "../middlewares/multer.middleware.js";
import authenticate from "../middlewares/auth.middleware.js";

const router = Router();

router
    .route("/")
    .post(
        //since we uploading video requires user to be loggedin, we donot require any query string, can get id from req.user
        authenticate,
        upload.fields([
            { name: "videoFile", maxCount: 1 },
            { name: "thumbnail", maxCount: 1 }
        ]),
        uploadVideo
    )
    //getting all video, means we need to take id for the user via query string
    .get(authenticate, getAllVideo); // takes query string eg. /api/v1/videos?page=1&

router
    .route("/:videoId")
    .get(authenticate, getVideoById)
    .delete(authenticate, deleteVideo)
    .patch(authenticate, upload.single("thumbnail"), updateVideo);

router.route("/:videoId/toggle-publish").patch(authenticate, togglePublishStatus);

export default router;

