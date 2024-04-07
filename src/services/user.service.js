
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import jwtProvider from "../config/jwtProvider.js";
async function createUser(reqData){
try {
    const {firstName,lastName,email,password}=reqData;

    const isUserExists=await User.findOne({email:email});
    if(isUserExists){
        throw new Error("User already exists with the email:"+email);
    }

    const saltRounds=10;
    let hashedPassword;
    hashedPassword=await bcrypt.hash(password,saltRounds);

     const user=await User.create({firstName,lastName,email,password:hashedPassword});

return user;


} catch (error) {
    throw new Error(error.message);
}
    
}

async function getUserById(userId){
try {

    const user=await User.findById(userId);
   
    if(!user){
       throw new Error("User not found with id "+userId);

    }
    return user;
    
} catch (error) {
    throw new Error(error.message);
}

}

async function getUserByEmail(userEmail) {
    try {
        console.log("Email received:", userEmail);
        const user = await User.findOne({ email: { $regex: new RegExp(userEmail, "i") } });
        if (!user) {
            throw new Error(`User not found with email: ${userEmail}`);
        }
        return user;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Error fetching user");
    }
}





async function getUserByToken(token){

    try {

        const userId=jwtProvider.getUserIdByToken(token);

        const user=await getUserById(userId);
        if(!user){
            throw new Error("User not found with id",userId);
     
         }
         return user;
        
    } catch (error) {
        throw new Error(error.message); 
    }

}

async function getAllUsers(){
    try {
        const users=User.find().populate("address");
        if(!users){
            throw new Error("Users not present");
        }
        return users;
        
    } catch (error) {
        throw new Error(error.message); 
    }
}

export default {
    createUser,
    getUserById,
    getUserByEmail,
    getUserByToken,
    getAllUsers,
};