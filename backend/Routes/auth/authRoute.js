import express from "express"
import { register, login, logout, authmiddleware } from '../../Controller/auth-controller.js'

const authRoute = express.Router();

authRoute.get('/authcheck', authmiddleware, (req, res) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        message: "Authentication success",
        user
    })
})

authRoute.post("/register", register);
authRoute.post("/login", login);
authRoute.post('/logout', logout)



export default authRoute