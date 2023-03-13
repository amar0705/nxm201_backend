const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {UserModel} = require("../model/user.model")
const {BlacklistModel} = require("../model/blacklist.model")
require("dotenv").config()

const userRouter = express.Router()

userRouter.post("/signup", async(req,res)=>{
    try{
        const {email, password, role} = req.body
        const userExists = await UserModel.findOne({email})
        if(userExists){
            return res.status(400).json({message:"User Already Exists"})
        }
        const hashed_password = bcrypt.hashSync(password,5)
        const user = new UserModel({email, password:hashed_password, role})
        await user.save()
        res.json({message:"User Signed up successfully"})
    }
    catch(err){
        res.send({message:"Something went wrong", error:err.message})
    }
})

userRouter.post("/login", async(req,res)=>{
    try{
        const {email,password} = req.body
        const user = await UserModel.findOne({email})
        if(!user){
            return res.json(401).json({message:"Wrong Credentials"})
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if(!isPasswordMatch){
            return res.status(401).json({message:"Wrong Credentials"})
        }
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, { expiresIn:60000})
        const refreshedToken = jwt.sign({userId:user._id}, process.env.REFRESH_JWT_SECRET,{expiresIn:300000})
        res.send({message:"Login Successful", token, refreshedToken})
    }
    catch(err){
        res.send({message:"Something went wrong", error:err.message})
    }
})

userRouter.post("/logout", async(req,res)=>{
    try{
        const token = req.headers.authorization
        const blacklistedToken = new BlacklistModel({token})
        await blacklistedToken.save()
        res.send({message:"User Logged Out Successfully"})
    }
    catch(err){
        res.send({message:"Something went wrong", error:err.message})
    }
})

userRouter.get("/newtoken", async(req,res)=>{
    let refreshedToken = req.headers.authorization
    if(!refreshedToken){
        res.send({message:"Please Login Again"})
    }
    jwt.verify(refreshedToken, process.env.REFRESH_JWT_SECRET, (err,decoded)=>{
        if(err){
            res.send({message:"Something went wrong", error:err.message})
        }
        else{
            let token = jwt.sign({userId: decoded.userId}, process.env.JWT_SECRET)
            res.send({message:"Login Successful", token})
        }
    })
})

module.exports = {userRouter}