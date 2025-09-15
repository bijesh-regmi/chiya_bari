import multer from "multer";

//this middleware takes file from request and saves it to path ./public/temp
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        //gives a unique suffix to the name of the file uploaded by the user
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix);
    }
});

const upload = multer({ storage: storage });
