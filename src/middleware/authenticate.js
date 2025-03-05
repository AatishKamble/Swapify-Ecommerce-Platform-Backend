import jwtProvider from "../config/jwtProvider.js";
import userService from "../services/user.service.js";
async function authenticate(req,res,next){
   
    try {

        const token=req.headers.authorization?.split(" ")[1];
    
        if(!token){  
            return res.status(404).send({message:"token not found"});
        }
        const userId=jwtProvider.getUserIdByToken(token);
       
        const user=await userService.getUserById(userId);  
     
        req.user=user; 
    
        
    } catch (error) {
       
        return res.status(500).send({error:error.message});
    }

    next();
}



export default authenticate;