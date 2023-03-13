const express = require("express")
const {connection} = require("./config/db")
const {userRouter} = require("./routes/user.route")
const {authMiddleware} = require("./middleware/authenticate.middleware")
const {otherRouter} = require("./routes/other.route")
const {authorise} = require("./middleware/authorise.middleware")

const app = express()
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("Homepage")
})

app.use("/", userRouter)
app.use(authMiddleware)
app.use("/", otherRouter)

app.listen(7700, async()=>{
    try{
        await connection
        console.log("Connected to the DB")
    }
    catch(err){
        console.log(err)
    }
    console.log("Listening to port 7700")
})