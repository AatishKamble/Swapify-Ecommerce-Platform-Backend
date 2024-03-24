import app from "./index.js"
import connectDB from "./config/db.js";
const PORT=3000;



app.listen(PORT,async()=>{
   await connectDB();
    console.log(`Server is running on port ${PORT}`);
})