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
    this.password = await bcrypt.hash(this.password, 10);
});

//we define instance method using documentSchema.methods. as below
//instance method is one you define on the document instance and not on model itself
//instance method to compare the password for correctness
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

//generating the access and refresh token for jwt
userSchema.methods.generateAccessToken = function () {
    //does not requires to be async as it is not time consuming and db operation is not done
    //this._id, this.username, etc. are already loaded in the Mongoose document instance.
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        {
            // algorithm:"RS256",//not providing means using default HMAC SHA256
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            //refresh token contains less information so only id is taken
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};
export const User = mongoose.model("User", userSchema);
