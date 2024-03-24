import mongoose from "mongoose";

const mongodbURL="mongodb+srv://atishk2454:L0NMEGcHBi7363hb@cluster0.dlnmsn6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const connectDB=()=>{
    return mongoose.connect(mongodbURL);
}

export default connectDB;
