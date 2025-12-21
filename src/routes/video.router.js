import { Router } from "express";
import { uploadVideo } from "../controllers/video.controller";
import upload from "../middlewares/multer.middleware";
import authenticate from "../middlewares/auth.middleware";
const router = Router();

router.route("/upload").post(
    authenticate,
    upload.fields([
        { name: "videoFile", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    uploadVideo
);
