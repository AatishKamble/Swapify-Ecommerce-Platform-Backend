import userService from "../services/user.service.js";
import jwtProvider from "../config/jwtProvider.js";
import cartService from "../services/cart.service.js";
import bcrypt from "bcrypt";
async function register(req, res) {
    try {
        const user = await userService.createUser(req.body);
        
        let jwt = jwtProvider.generateToken(user._id);
        await cartService.createCart(user._id);
        return res.status(200).send({ jwt, message: "Created Successfully" });

    } catch (error) {
        return res.status(500).send({error:error.message});
    }


}

async function login(req, res) {
    const { email, password } = req.body;
    try {
        
        const user = await userService.getUserByEmail(email);
        
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
 

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send({ message: "Wrong password" });
        }
        const jwt = jwtProvider.generateToken(user._id);

        return res.status(200).send({ jwt, message: "Login successfull" })

    } catch (error) {
        return res.status(500).send({error:error.message});
    }
}

export default{
    register,
    login,
}

