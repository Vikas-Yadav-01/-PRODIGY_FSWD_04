
import connectDB from "./db/db.js";
import app from "./app.js";

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server is running on port: ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log("Server listening failed", err);
    })