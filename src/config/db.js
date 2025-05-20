import mongoose from "mongoose";
import "dotenv/config";

const mongodbURL=process.env.MONGODB_URL;

const connectDB=()=>{
    return mongoose.connect(mongodbURL);
}

export default connectDB;
