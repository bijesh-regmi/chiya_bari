import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile: {
            type: String, //cloudinary
            required: true
        },
        thumbnail: {
            type: String, //cloudinary
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        duration: {
            type: String, //cloudinary
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    { timestamps: true }
);
videoSchema.plugin(mongooseAggregatePaginate);
export const Video = mongoose.model("Video", videoSchema);

//Mock Data collection
/*
[
    { "_id": "7581v1v1c1v1v1v1v1v1v202", "videoFile": "https://cloudinary.com/v/v2.mp4", "thumbnail": "https://cloudinary.com/t/t2.jpg", "title": "Mongoose Deep Dive", "description": "Understanding Schemas and Models", "duration": "20:10", "views": 890, "isPublished": true, "owner": "6581a1a1b1a1a1a1a1a1a101", "createdAt": "2023-12-06T12:00:00Z" },
    { "_id": "7581v1v1c1v1v1v1v1v1v203", "videoFile": "https://cloudinary.com/v/v3.mp4", "thumbnail": "https://cloudinary.com/t/t3.jpg", "title": "Cooking Pasta 101", "description": "Best Italian Pasta recipes", "duration": "08:30", "views": 3200, "isPublished": true, "owner": "6581a1a1b1a1a1a1a1a1a103", "createdAt": "2023-12-07T09:00:00Z" },
    { "_id": "7581v1v1c1v1v1v1v1v1v204", "videoFile": "https://cloudinary.com/v/v4.mp4", "thumbnail": "https://cloudinary.com/t/t4.jpg", "title": "React for Beginners", "description": "Starting with React Hooks", "duration": "15:00", "views": 450, "isPublished": false, "owner": "6581a1a1b1a1a1a1a1a1a104", "createdAt": "2023-12-08T15:30:00Z" },
    { "_id": "7581v1v1c1v1v1v1v1v1v205", "videoFile": "https://cloudinary.com/v/v5.mp4", "thumbnail": "https://cloudinary.com/t/t5.jpg", "title": "MongoDB Aggregation", "description": "Complex queries made easy", "duration": "25:45", "views": 120, "isPublished": true, "owner": "6581a1a1b1a1a1a1a1a1a105", "createdAt": "2023-12-09T11:00:00Z" },
    { "_id": "7581v1v1c1v1v1v1v1v1v206", "videoFile": "https://cloudinary.com/v/v6.mp4", "thumbnail": "https://cloudinary.com/t/t6.jpg", "title": "Travel Vlogs: Paris", "description": "Exploring the Eiffel Tower", "duration": "10:20", "views": 5600, "isPublished": true, "owner": "6581a1a1b1a1a1a1a1a1a106", "createdAt": "2023-12-10T14:00:00Z" },
    { "_id": "7581v1v1c1v1v1v1v1v1v207", "videoFile": "https://cloudinary.com/v/v7.mp4", "thumbnail": "https://cloudinary.com/t/t7.jpg", "title": "Express Middleware", "description": "Mastering Express.js", "duration": "18:00", "views": 780, "isPublished": true, "owner": "6581a1a1b1a1a1a1a1a1a107", "createdAt": "2023-12-11T16:00:00Z" },
    { "_id": "7581v1v1c1v1v1v1v1v1v208", "videoFile": "https://cloudinary.com/v/v8.mp4", "thumbnail": "https://cloudinary.com/t/t8.jpg", "title": "How to Sing", "description": "Vocal exercises for everyone", "duration": "05:50", "views": 9000, "isPublished": true, "owner": "6581a1a1b1a1a1a1a1a1a108", "createdAt": "2023-12-12T10:00:00Z" },
    { "_id": "7581v1v1c1v1v1v1v1v1v209", "videoFile": "https://cloudinary.com/v/v9.mp4", "thumbnail": "https://cloudinary.com/t/t9.jpg", "title": "Acting Secrets", "description": "Behind the scenes with Ian", "duration": "30:00", "views": 15000, "isPublished": true, "owner": "6581a1a1b1a1a1a1a1a1a109", "createdAt": "2023-12-13T12:00:00Z" },
    { "_id": "7581v1v1c1v1v1v1v1v1v210", "videoFile": "https://cloudinary.com/v/v10.mp4", "thumbnail": "https://cloudinary.com/t/t10.jpg", "title": "JavaScript Closures", "description": "Functional Programming concepts", "duration": "12:15", "views": 340, "isPublished": true, "owner": "6581a1a1b1a1a1a1a1a1a110", "createdAt": "2023-12-14T09:00:00Z" },
    { "_id": "7581v1v1c1v1v1v1v1v1v211", "videoFile": "https://cloudinary.com/v/v11.mp4", "thumbnail": "https://cloudinary.com/t/t11.jpg", "title": "Standup Comedy", "description": "Laughter is best medicine", "duration": "45:00", "views": 25000, "isPublished": true, "owner": "6581a1a1b1a1a1a1a1a1a111", "createdAt": "2023-12-15T20:00:00Z" },
    { "_id": "7581v1v1c1v1v1v1v1v1v212", "videoFile": "https://cloudinary.com/v/v12.mp4", "thumbnail": "https://cloudinary.com/t/t12.jpg", "title": "Archaeology Basics", "description": "Unearthing history", "duration": "50:00", "views": 670, "isPublished": true, "owner": "6581a1a1b1a1a1a1a1a1a112", "createdAt": "2023-12-16T11:00:00Z" },
    { "_id": "7581v1v1c1v1v1v1v1v1v213", "videoFile": "https://cloudinary.com/v/v13.mp4", "thumbnail": "https://cloudinary.com/t/t13.jpg", "title": "Monster Scare Guide", "description": "How to scare 101", "duration": "07:00", "views": 12000, "isPublished": true, "owner": "6581a1a1b1a1a1a1a1a1a113", "createdAt": "2023-12-17T14:30:00Z" },
    { "_id": "7581v1v1c1v1v1v1v1v1v214", "videoFile": "https://cloudinary.com/v/v14.mp4", "thumbnail": "https://cloudinary.com/t/t14.jpg", "title": "Jazz Music Mix", "description": "Relaxing jazz tunes", "duration": "60:00", "views": 4500, "isPublished": true, "owner": "6581a1a1b1a1a1a1a1a1a114", "createdAt": "2023-12-18T18:00:00Z" },
    { "_id": "7581v1v1c1v1v1v1v1v1v215", "videoFile": "https://cloudinary.com/v/v15.mp4", "thumbnail": "https://cloudinary.com/t/t15.jpg", "title": "Sci-Fi Acting", "description": "Star Wars techniques", "duration": "22:00", "views": 8900, "isPublished": true, "owner": "6581a1a1b1a1a1a1a1a1a115", "createdAt": "2023-12-19T10:00:00Z" },
    { "_id": "7581v1v1c1v1v1v1v1v1v216", "videoFile": "https://cloudinary.com/v/v16.mp4", "thumbnail": "https://cloudinary.com/t/t16.jpg", "title": "Ant-Man Trivia", "description": "Everything about the micro world", "duration": "11:40", "views": 3200, "isPublished": true, "owner": "6581a1a1b1a1a1a1a1a1a116", "createdAt": "2023-12-19T14:00:00Z" },
    { "_id": "7581v1v1c1v1v1v1v1v1v217", "videoFile": "https://cloudinary.com/v/v17.mp4", "thumbnail": "https://cloudinary.com/t/t17.jpg", "title": "Vocal High Notes", "description": "Glee club warmups", "duration": "09:15", "views": 1100, "isPublished": true, "owner": "6581a1a1b1a1a1a1a1a1a117", "createdAt": "2023-12-19T16:00:00Z" },
    { "_id": "7581v1v1c1v1v1v1v1v1v218", "videoFile": "https://cloudinary.com/v/v18.mp4", "thumbnail": "https://cloudinary.com/t/t18.jpg", "title": "Fitness Routine", "description": "Daily workout for athletes", "duration": "15:50", "views": 560, "isPublished": true, "owner": "6581a1a1b1a1a1a1a1a1a118", "createdAt": "2023-12-19T18:00:00Z" },
    { "_id": "7581v1v1c1v1v1v1v1v1v219", "videoFile": "https://cloudinary.com/v/v19.mp4", "thumbnail": "https://cloudinary.com/t/t19.jpg", "title": "Shield Defense", "description": "Tactics with a shield", "duration": "14:20", "views": 4000, "isPublished": true, "owner": "6581a1a1b1a1a1a1a1a1a119", "createdAt": "2023-12-20T08:00:00Z" },
    { "_id": "7581v1v1c1v1v1v1v1v1v220", "videoFile": "https://cloudinary.com/v/v20.mp4", "thumbnail": "https://cloudinary.com/t/t20.jpg", "title": "Sketch Comedy Writing", "description": "Tips for SNL style writing", "duration": "28:30", "views": 6700, "isPublished": true, "owner": "6581a1a1b1a1a1a1a1a1a120", "createdAt": "2023-12-20T10:00:00Z" }
    { "_id": "7581v1v1c1v1v1v1v1v1v201", "videoFile": "https://cloudinary.com/v/v1.mp4", "thumbnail": "https://cloudinary.com/t/t1.jpg", "title": "Learning Node.js", "description": "Complete guide to Node.js", "duration": "12:45", "views": 1500, "isPublished": true, "owner": "6581a1a1b1a1a1a1a1a1a101", "createdAt": "2023-12-05T10:00:00Z" },
]
 */
