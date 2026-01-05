import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
        credentials: true
    })
);

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

//import router
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.router.js";
import subscriptionRouter from "./routes/subscription.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
export default app;
