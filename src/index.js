import connectDB from "./db/dbConnect.js"
import app from "./app.js"
const PORT = process.env.PORT

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log("server running.....at:", PORT)
        })
    })
    .catch((error) => {
        console.log("There is some problem starting the server", error)
    })
