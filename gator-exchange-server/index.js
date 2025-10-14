const express = require("express")
const mongoose = require('mongoose')
const cors = require("cors")
const usersModel = require("./models/users")

const app = express()
//transfer data from frontend to backend (injson format)
app.use(express.json())
app.use(cors())

//create database connection
mongoose.connect("mongodb://127.0.0.1:27017/gator-exchange-users")

//server app
app.post("/register", (req, res) => {
    //data coming from front end is on req.body
    usersModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err))
})
app.listen(3001, () => {
    console.log("server is running")
})

