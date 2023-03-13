// /products, /addproducts, /deleteproducts.

const express = require("express")
const {authorise} = require("../middleware/authorise.middleware")

const otherRouter = express.Router()

otherRouter.get("/products", (req,res)=>{
    res.send("These are the products")
})

otherRouter.get("/addproducts", authorise(["seller"]), (req,res)=>{
    res.send("The products have been added by the seller")
})

otherRouter.get("/deleteproducts", authorise(["seller"]), (req,res)=>{
    res.send("The products have been deleted by the seller")
})

module.exports = {otherRouter}