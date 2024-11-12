import "dotenv/config";
import http from "http";
import app from "./app";
import { connectDB } from "./config/db";

import { socketService } from "./utils/socket";
import { PORT } from "./config/env";

const server = http.createServer(app);

try {
    socketService.initialize(server);
    console.log("Socket.io initialized");
} catch (error) {
    console.log("Failed to initialize socket.io", error);
    process.exit(1);
}

server.listen(PORT, async () => {
    try {
        await connectDB();
        console.log("Server is running on port :", PORT);
    } catch (error) {
        console.log("Failed to connect to DB", error);
        process.exit(1);
    }
});
