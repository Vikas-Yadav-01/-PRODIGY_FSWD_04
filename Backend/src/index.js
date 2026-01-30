import http from "http";
import connectDB from "./db/db.js";
import app from "./app.js";
import { initSocket } from "./socket.js";

connectDB()
    .then(() => {
        const server = http.createServer(app)

        initSocket(server)

        server.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log("Server listening failed", err);
    })