import { Router } from "express";
import {
    toggleSubscription,
    getUserSubscribedChannels,
    getChannelSubscribers
} from "../controllers/sayDemoSubscription.controller.js";
import authenticate from "../middlewares/auth.middleware.js";

const router = Router();

// Toggle subscription (subscribe/unsubscribe)
router
    .route("/toggle/:channelId")
    .post(authenticate, toggleSubscription);

// Get all channels a user is subscribed to
router
    .route("/subscribed-channels")
    .get(authenticate, getUserSubscribedChannels);

// Get all subscribers of a channel
router
    .route("/channel/:channelId/subscribers")
    .get(authenticate, getChannelSubscribers);

export default router;





