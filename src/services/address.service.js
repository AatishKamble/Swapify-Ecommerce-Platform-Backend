import Address from "../models/address.model.js";

async function areLocationExits(locationSet){
    try {
     
    const existingLocations=await Address.find({state:{$in:[...locationSet]}});
    
    if(existingLocations.length>0){
        console.log(existingLocations)
        return true;
    }
    else{
        return false;
    }

    } catch (error) {
        console.log("error in locatios finding",error);
        return false;
    }
    
}

export default areLocationExits;