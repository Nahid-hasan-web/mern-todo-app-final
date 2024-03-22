const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const multer = require('multer')
const rateLimit = require('express-rate-limit')
const bodyParser = require('body-parser')
const  route  = require('./src/routes/api')
require('dotenv').config()




app.use(bodyParser.json())

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 2000
}))

app.use(cors())
app.use(express.json())


const uri = "mongodb+srv://esmern2304practice:<password>@cluster0.cu59mgu.mongodb.net/ToDoPlanner?retryWrites=true&w=majority&appName=Cluster0"
const options = {user:process.env.DB_USERNAME, pass:process.env.DB_PASSWORD}

// mongodb+srv://esmern2304practice:esmern2304practice@cluster0.cu59mgu.mongodb.net/ToDoPlanner?retryWrites=true&w=majority&appName=Cluster0

mongoose.connect(uri, options)
.then(()=>{console.log("DB connected");})
.catch((err)=>{console.log(err)})




app.use("/api/v1", route)

app.use("*",(req,res)=>{
res.status(404).json({message:"Not Found"})
})

module.exports = app