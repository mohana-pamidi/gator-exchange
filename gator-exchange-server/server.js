const connect = require("./connect")
const express = require("express")
const cors = require("cors")
const posts = require("./postRoutes")

const app = express() 

const PORT = 5000

app.use(cors())  // mounts middleware
app.use(express.json())
app.use(posts) // mounts the postRoutes

app.listen(PORT, () => {
    connect.connectToServer()
    console.log(`Server is running on port: ${PORT}`)
})