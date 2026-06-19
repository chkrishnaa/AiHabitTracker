import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        const uri = process.env.MONGO_URI;
        if(!uri) throw new Error("MONGODB_URI is not defined");
        const connect = await mongoose.connect(uri);
        console.log(`MongoDB connected: ${connect.connection.host}`);
    }catch(e){
        console.error("Error connecting to MongoDB:", e.message);
        process.exit(1);
    }
}