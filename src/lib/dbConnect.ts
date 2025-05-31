import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to db");
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "");
        connection.isConnected = db.connections[0].readyState;
        console.log("DB is connected successfully");
    } catch (error) {
        console.log("DB connection failed", error);
        throw new Error("DB connection failed");
    }
}
export default dbConnect;