import { Router } from "express";
import { uploadVideo } from "../controllers/video.controller.js";
import upload from "../middlewares/multer.middleware.js";
import authenticate from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/upload").post(
    authenticate,
    upload.fields([
        { name: "videoFile", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    uploadVideo
);
