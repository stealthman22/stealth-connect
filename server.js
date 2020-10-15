//  call in express
const express = require('express')

// initialize express
const app = express()

// test endpoint
app.get('/', (req, res) => res.send("Application running without hiccups"))

// create the port
const PORT = process.env.PORT || 6000

// start server
app.listen(PORT, ()=> {
    console.log(`Application running on Port ${PORT}`)
})