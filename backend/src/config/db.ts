import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(
            process.env.MONGO_URI || "mongodb://localhost:27017/solana"
        );
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
        throw error;
    }
};
