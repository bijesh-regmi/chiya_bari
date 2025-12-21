import mongoose, { Schema } from "mongoose";
const CommentSchema = new Schema(
    {
        content: {
            type: String,
            require: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "User  "
        },
        createdAt: {
            type: Date,
            require: true,
            default: Date.now()
        },
        updatedAt: {
            type: Date,
            require: true,
            default: Date.now()
        }
    },
    {timestamps:true}
);
