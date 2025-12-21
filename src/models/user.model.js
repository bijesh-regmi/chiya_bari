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
        subscribedTo: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
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
    next();
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
            _id: this._id
            //usually only id is needed
            // username: this.username,
            // email: this.email,
            // fullName: this.fullName
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

//Mock Data collection
/**
 * [
{ "_id": "6581a1a1b1a1a1a1a1a1a102", "username": "bob_builder", "email": "bob@example.com", "fullName": "Bob Smith", "password": "$2b$10$hashedpassword2", "avatar": "https://cloudinary.com/v123/bob.jpg", "coverImage": "", "subscribedTo": ["6581a1a1b1a1a1a1a1a1a101"], "watchHistory": ["7581v1v1c1v1v1v1v1v1v201", "7581v1v1c1v1v1v1v1v1v202"], "refreshToken": "rt_token_102", "createdAt": "2023-12-01T11:00:00Z" },
{ "_id": "6581a1a1b1a1a1a1a1a1a103", "username": "charlie_chef", "email": "charlie@example.com", "fullName": "Charlie Brown", "password": "$2b$10$hashedpassword3", "avatar": "https://cloudinary.com/v123/charlie.jpg", "coverImage": "https://cloudinary.com/v123/c_cover.jpg", "subscribedTo": [], "watchHistory": ["7581v1v1c1v1v1v1v1v1v211", "7581v1v1c1v1v1v1v1v1v213"], "refreshToken": null, "createdAt": "2023-12-02T09:30:00Z" },
{ "_id": "6581a1a1b1a1a1a1a1a1a104", "username": "diana_dash", "email": "diana@example.com", "fullName": "Diana Prince", "password": "$2b$10$hashedpassword4", "avatar": "https://cloudinary.com/v123/diana.jpg", "coverImage": "", "subscribedTo": [], "watchHistory": ["7581v1v1c1v1v1v1v1v1v205", "7581v1v1c1v1v1v1v1v1v220"], "refreshToken": "rt_token_104", "createdAt": "2023-12-03T08:15:00Z" },
{ "_id": "6581a1a1b1a1a1a1a1a1a105", "username": "ethan_hunt", "email": "ethan@example.com", "fullName": "Ethan Hunt", "password": "$2b$10$hashedpassword5", "avatar": "https://cloudinary.com/v123/ethan.jpg", "coverImage": "https://cloudinary.com/v123/e_cover.jpg", "subscribedTo": ["6581a1a1b1a1a1a1a1a1a102"], "watchHistory": ["7581v1v1c1v1v1v1v1v1v208", "7581v1v1c1v1v1v1v1v1v214"], "refreshToken": "rt_token_105", "createdAt": "2023-12-04T12:00:00Z" },
{ "_id": "6581a1a1b1a1a1a1a1a1a106", "username": "fiona_fly", "email": "fiona@example.com", "fullName": "Fiona Gallagher", "password": "$2b$10$hashedpassword6", "avatar": "https://cloudinary.com/v123/fiona.jpg", "coverImage": "", "subscribedTo": [], "watchHistory": ["7581v1v1c1v1v1v1v1v1v219"], "refreshToken": null, "createdAt": "2023-12-05T14:20:00Z" },
{ "_id": "6581a1a1b1a1a1a1a1a1a107", "username": "george_j", "email": "george@example.com", "fullName": "George Jetson", "password": "$2b$10$hashedpassword7", "avatar": "https://cloudinary.com/v123/george.jpg", "coverImage": "https://cloudinary.com/v123/g_cover.jpg", "subscribedTo": [], "watchHistory": ["7581v1v1c1v1v1v1v1v1v201", "7581v1v1c1v1v1v1v1v1v207"], "refreshToken": "rt_token_107", "createdAt": "2023-12-06T16:45:00Z" },
{ "_id": "6581a1a1b1a1a1a1a1a1a108", "username": "hannah_h", "email": "hannah@example.com", "fullName": "Hannah Montana", "password": "$2b$10$hashedpassword8", "avatar": "https://cloudinary.com/v123/hannah.jpg", "coverImage": "", "subscribedTo": ["6581a1a1b1a1a1a1a1a1a101"], "watchHistory": ["7581v1v1c1v1v1v1v1v1v203", "7581v1v1c1v1v1v1v1v1v215"], "refreshToken": "rt_token_108", "createdAt": "2023-12-07T10:10:00Z" },
{ "_id": "6581a1a1b1a1a1a1a1a1a109", "username": "ian_m", "email": "ian@example.com", "fullName": "Ian McKellen", "password": "$2b$10$hashedpassword9", "avatar": "https://cloudinary.com/v123/ian.jpg", "coverImage": "", "subscribedTo": [], "watchHistory": ["7581v1v1c1v1v1v1v1v1v211", "7581v1v1c1v1v1v1v1v1v212"], "refreshToken": null, "createdAt": "2023-12-08T11:00:00Z" },
{ "_id": "6581a1a1b1a1a1a1a1a1a110", "username": "jenny_z", "email": "jenny@example.com", "fullName": "Jenny Zhang", "password": "$2b$10$hashedpassword10", "avatar": "https://cloudinary.com/v123/jenny.jpg", "coverImage": "https://cloudinary.com/v123/j_cover.jpg", "subscribedTo": [], "watchHistory": ["7581v1v1c1v1v1v1v1v1v202", "7581v1v1c1v1v1v1v1v1v210"], "refreshToken": "rt_token_110", "createdAt": "2023-12-09T09:00:00Z" },
{ "_id": "6581a1a1b1a1a1a1a1a1a111", "username": "kevin_k", "email": "kevin@example.com", "fullName": "Kevin Hart", "password": "$2b$10$hashedpassword11", "avatar": "https://cloudinary.com/v123/kevin.jpg", "coverImage": "", "subscribedTo": [], "watchHistory": ["7581v1v1c1v1v1v1v1v1v209"], "refreshToken": "rt_token_111", "createdAt": "2023-12-10T12:00:00Z" },
{ "_id": "6581a1a1b1a1a1a1a1a1a112", "username": "laura_l", "email": "laura@example.com", "fullName": "Laura Croft", "password": "$2b$10$hashedpassword12", "avatar": "https://cloudinary.com/v123/laura.jpg", "coverImage": "https://cloudinary.com/v123/l_cover.jpg", "subscribedTo": [], "watchHistory": ["7581v1v1c1v1v1v1v1v1v216", "7581v1v1c1v1v1v1v1v1v206"], "refreshToken": null, "createdAt": "2023-12-11T13:30:00Z" },
{ "_id": "6581a1a1b1a1a1a1a1a1a113", "username": "mike_m", "email": "mike@example.com", "fullName": "Mike Wazowski", "password": "$2b$10$hashedpassword13", "avatar": "https://cloudinary.com/v123/mike.jpg", "coverImage": "", "subscribedTo": [], "watchHistory": ["7581v1v1c1v1v1v1v1v1v215"], "refreshToken": "rt_token_113", "createdAt": "2023-12-12T15:00:00Z" },
{ "_id": "6581a1a1b1a1a1a1a1a1a114", "username": "nina_n", "email": "nina@example.com", "fullName": "Nina Simone", "password": "$2b$10$hashedpassword14", "avatar": "https://cloudinary.com/v123/nina.jpg", "coverImage": "", "subscribedTo": [], "watchHistory": ["7581v1v1c1v1v1v1v1v1v204", "7581v1v1c1v1v1v1v1v1v218"], "refreshToken": "rt_token_114", "createdAt": "2023-12-13T10:45:00Z" },
{ "_id": "6581a1a1b1a1a1a1a1a1a115", "username": "oscar_o", "email": "oscar@example.com", "fullName": "Oscar Isaac", "password": "$2b$10$hashedpassword15", "avatar": "https://cloudinary.com/v123/oscar.jpg", "coverImage": "https://cloudinary.com/v123/o_cover.jpg", "subscribedTo": [], "watchHistory": ["7581v1v1c1v1v1v1v1v1v219", "7581v1v1c1v1v1v1v1v1v220"], "refreshToken": "rt_token_115", "createdAt": "2023-12-14T14:00:00Z" },
{ "_id": "6581a1a1b1a1a1a1a1a1a116", "username": "paul_p", "email": "paul@example.com", "fullName": "Paul Rudd", "password": "$2b$10$hashedpassword16", "avatar": "https://cloudinary.com/v123/paul.jpg", "coverImage": "", "subscribedTo": [], "watchHistory": ["7581v1v1c1v1v1v1v1v1v211", "7581v1v1c1v1v1v1v1v1v213"], "refreshToken": "rt_token_116", "createdAt": "2023-12-15T11:20:00Z" },
{ "_id": "6581a1a1b1a1a1a1a1a1a120", "username": "tina_t", "email": "tina@example.com", "fullName": "Tina Fey", "password": "$2b$10$hashedpassword20", "avatar": "https://cloudinary.com/v123/tina.jpg", "coverImage": "", "subscribedTo": [], "watchHistory": ["7581v1v1c1v1v1v1v1v1v211", "7581v1v1c1v1v1v1v1v1v212"], "refreshToken": "rt_token_120", "createdAt": "2023-12-19T10:30:00Z" }
{ "_id": "6581a1a1b1a1a1a1a1a1a117", "username": "quinn_q", "email": "quinn@example.com", "fullName": "Quinn Fabray", "password": "$2b$10$hashedpassword17", "avatar": "https://cloudinary.com/v123/quinn.jpg", "coverImage": "https://cloudinary.com/v123/q_cover.jpg", "subscribedTo": [], "watchHistory": ["7581v1v1c1v1v1v1v1v1v201", "7581v1v1c1v1v1v1v1v1v210"], "refreshToken": null, "createdAt": "2023-12-16T16:00:00Z" },
{ "_id": "6581a1a1b1a1a1a1a1a1a118", "username": "riley_r", "email": "riley@example.com", "fullName": "Riley Reid", "password": "$2b$10$hashedpassword18", "avatar": "https://cloudinary.com/v123/riley.jpg", "coverImage": "", "subscribedTo": [], "watchHistory": ["7581v1v1c1v1v1v1v1v1v205", "7581v1v1c1v1v1v1v1v1v217"], "refreshToken": "rt_token_118", "createdAt": "2023-12-17T09:10:00Z" },
{ "_id": "6581a1a1b1a1a1a1a1a1a119", "username": "steve_s", "email": "steve@example.com", "fullName": "Steve Rogers", "password": "$2b$10$hashedpassword19", "avatar": "https://cloudinary.com/v123/steve.jpg", "coverImage": "https://cloudinary.com/v123/s_cover.jpg", "subscribedTo": [], "watchHistory": ["7581v1v1c1v1v1v1v1v1v201", "7581v1v1c1v1v1v1v1v1v202"], "refreshToken": "rt_token_119", "createdAt": "2023-12-18T12:00:00Z" },
{ "_id": "6581a1a1b1a1a1a1a1a1a101", "username": "alice_dev", "email": "alice@example.com", "fullName": "Alice Johnson", "password": "$2b$10$hashedpassword1", "avatar": "https://cloudinary.com/v123/alice.jpg", "coverImage": "https://cloudinary.com/v123/alice_cover.jpg", "subscribedTo": [], "watchHistory": ["7581v1v1c1v1v1v1v1v1v203", "7581v1v1c1v1v1v1v1v1v209"], "refreshToken": "rt_token_101", "createdAt": "2023-12-01T10:00:00Z" },
]
 */
