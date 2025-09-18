import { Router } from "express";
import {
    registerUser,
    userLogin,
    userLogOut
} from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

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
router.route("/logout").post(verifyJWT, userLogOut);

export default router;
