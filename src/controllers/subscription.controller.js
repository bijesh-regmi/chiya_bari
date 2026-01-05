import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";

export const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const subscriberId = req.user?._id;

    if (!channelId?.trim()) {
        throw new ApiError(400, "Channel ID is required");
    }

    // Check if channel exists
    const channel = await User.findById(channelId);
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    // Prevent self-subscription
    if (subscriberId.toString() === channelId.toString()) {
        throw new ApiError(400, "Cannot subscribe to your own channel");
    }

    // Check if subscription already exists
    const existingSubscription = await Subscription.findOne({
        subscriber: subscriberId,
        channel: channelId
    });

    if (existingSubscription) {
        // Unsubscribe: Delete the subscription
        await Subscription.findByIdAndDelete(existingSubscription._id);

        return res.status(200).json(
            new ApiResponse(200, { isSubscribed: false }, "Unsubscribed successfully")
        );
    } else {
        // Subscribe: Create new subscription
        await Subscription.create({
            subscriber: subscriberId,
            channel: channelId
        });

        return res.status(200).json(
            new ApiResponse(200, { isSubscribed: true }, "Subscribed successfully")
        );
    }
});

export const getUserSubscribedChannels = asyncHandler(async (req, res) => {
    const subscriberId = req.user?._id;
    const subscriptions = await Subscription.find({ subscriber: subscriberId }).populate(
        "channel",
        "username fullName avatar"
    );

    if (!subscriptions || subscriptions.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, [], "No subscriptions found")
        );
    }

    const channels = subscriptions.map((sub) => sub.channel);

    return res.status(200).json(
        new ApiResponse(200, channels, "Subscribed channels fetched successfully")
    );
});

export const getChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!channelId?.trim()) {
        throw new ApiError(400, "Channel ID is required");
    }

    // Check if channel exists
    const channel = await User.findById(channelId);
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    const subscriptions = await Subscription.find({ channel: channelId }).populate(
        "subscriber",
        "username fullName avatar"
    );

    const subscribers = subscriptions.map((sub) => sub.subscriber);

    return res.status(200).json(
        new ApiResponse(
            200,
            { subscribers, count: subscribers.length },
            "Channel subscribers fetched successfully"
        )
    );
});

