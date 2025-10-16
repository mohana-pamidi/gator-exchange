const connect = require("./connect")
const express = require("express")
const cors = require("cors")

const app = express() 

const PORT = 5000

app.use(cors())  // mounts middleware
app.use(express.json())

// test route
app.get("/api/test", (req, res) => {
    res.json({ message: "backend route working" });
})

app.listen(PORT, () => {
    connect.connectToServer()
    console.log(`Server is running on port: ${PORT}`)
})