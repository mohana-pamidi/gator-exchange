const express = require("express")
const mongoose = require('mongoose')
const cors = require("cors")
const usersModel = require("./models/users")
const connect = require("./connect")
const posts = require("./postRoutes")
require("dotenv").config({path: "./config.env"})

const app = express()
//transfer data from frontend to backend (injson format)
app.use(express.json())
app.use(cors())

//create database connection
mongoose.connect(process.env.ATLAS_URI)

app.post("/login", (req, res) => {
    const {email, password} = req.body;

    usersModel.findOne({email: email})

    //can check for user auth here 
    .then(user => {
        if(user)
        {
           if(user.password === password)
            {
                res.json("Success")
            } 
            else
            {
                res.json("Wrong Password")
            } 
        }
        else
        {
            res.json("No record")
        }
        
    })
})

//server app
app.post("/register", (req, res) => {
    //data coming from front end is on req.body
    console.log("Registration attempt:", req.body)
    usersModel.create(req.body)
    .then(users => {
        console.log("User created successfully:", users)
        res.json(users)
    })
    .catch(err => {
        console.error("Registration error:", err)
        res.status(400).json(err)
    })
})
app.listen(3001, async () => {
    try {
        // Connect Mongoose
        await mongoose.connection.asPromise()
        console.log("Mongoose connected to Atlas")
        
        connect.connectToServer()
        console.log(`Server is running on port: 3001`)
        
    } catch (error) {
        console.error("❌ Database connection error:", error)
    }
})
