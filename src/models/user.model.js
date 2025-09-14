import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
            index: true
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String, //cloudinary url
            required: true
        },
        coverImage: {
            type: String
        },
        watchHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        refreshToken: {
            type: String
        }
    },

    { timestamps: true }
);

//this pre hook encrypt the password before saving it, it is executed when save event is triggered
userSchema.pre("save", async function (next) {
    //since this is triggered every time the document is saved, it keeps changing the password
    //so password modification condition is checked first
    if (!this.isModified("password")) return next();
    //early return makes sure the password is not rehashed every time
    this.password = bcrypt.hash(this.password, 10);
});

export const User = mongoose.model("User", userSchema);
