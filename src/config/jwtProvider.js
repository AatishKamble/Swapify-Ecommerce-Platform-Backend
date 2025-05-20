import  Jwt  from "jsonwebtoken";

const SECRETE_KEY=process.env.SECRETE_KEY;

function generateToken(userId){
    
    const token=Jwt.sign({userId},SECRETE_KEY,{expiresIn:"48h"});
    
    return token;

}


function getUserIdByToken(token){
    const decodedToken=Jwt.verify(token,SECRETE_KEY);
   
    return decodedToken.userId;
}

export default{generateToken,getUserIdByToken};