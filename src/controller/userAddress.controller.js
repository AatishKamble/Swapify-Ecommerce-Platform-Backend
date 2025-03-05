import addressService  from "../services/address.service.js"

const createNewAddress=async (req,res)=>{
try {
    const user=req.user;
    const address=await addressService.createAddress(user._id,req.body);
   res.status(200).send(address);
    
} catch (error) {
   res.status(500).send({error:error.message}) 
}

}

const getAddresses=async (req,res)=>{
    try {
        const user=req.user;
        const address=await addressService.getAddressByuserId(user._id);
        res.status(200).send(address);
    } catch (error) {
        res.status(500).send({error:error.message}) 
    }
}

export default {createNewAddress,getAddresses};