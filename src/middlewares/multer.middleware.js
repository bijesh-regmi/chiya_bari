import multer from "multer"
//this middleware takes file from request and saves it to path ./public/temp
// create a custom storage engine for multer (tells multer HOW to store files on disk)
const storage = multer.diskStorage({
    // 'destination' function:
    // Called every time a file is uploaded.
    // Lets you specify the folder path where the uploaded file should be saved.
    destination: function (req, file, cb) {
        // Here: no error (null), and save inside ./public/temp directory
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        cb(null, file.fieldname + "-" + uniqueSuffix)
    }
})
// Initialize multer with the above storage engine
// This returns an 'upload' middleware that can process multipart/form-data (file uploads)
const upload = multer({ storage })
export default upload
