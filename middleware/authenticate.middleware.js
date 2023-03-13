const jwt = require("jsonwebtoken")
require("dotenv").config()
const {UserModel} = require("../model/user.model")

const authMiddleware = async(req,res,next)=>{
    try{
        const token = req.headers.authorization
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const {userId} = decodedToken
        const user = await UserModel.findById(userId)
        if(!user){
            return res.status(401).json({message:"Not Authorized"})
        }
        req.user = user
        next()
    }
    catch(err){
        return res.status(401).json({message:"Not Authorized"})
    }
}

module.exports = {authMiddleware}