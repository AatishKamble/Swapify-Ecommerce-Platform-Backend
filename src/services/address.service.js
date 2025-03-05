
import Address from "../models/address.model.js"
async function createAddress(userId,reqData){
try {

const isPresent= await Address.find({
    firstName:reqData.firstName,
    lastName:reqData.lastName,
    mobile:reqData.mobile,
     houseNo:reqData.houseNo,
    streetAddress:reqData.streetAddress,
    city:reqData.city,
    state: reqData.state,
    zipCode:reqData.zipCode,
    user:userId
});

if(!isPresent){
    const newAddress=new Address.find({
        firstName:reqData.firstName,
        lastName:reqData.lastName,
        mobile:reqData.mobile,
         houseNo:reqData.houseNo,
        streetAddress:reqData.streetAddress,
        city:reqData.city,
        state: reqData.state,
        zipCode:reqData.zipCode,
        user:userId
    });
    await newAddress.save();

        return newAddress;

}

return isPresent;
    
} catch (error) {
    throw new Error(error.message);
}

}


async function getAddressByuserId(userId){
    try {
    
    const isPresent= await Address.find({
        user:userId
    });
    
    if(!isPresent){
       throw new Error("Address Not found");
    }
    
    return isPresent;
        
    } catch (error) {
        throw new Error(error.message);
    }
    
    }



    export default {
        createAddress,
        getAddressByuserId
    }