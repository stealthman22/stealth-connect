//  call in express
const express = require('express')
// call in db connection
const connectDB = require('./config/db')


// initialize express
const app = express()

// connect Database
connectDB()

// init middleware
// instead of calling bodyparser as in the past
app.use(express.json({extended: false}))


// test endpoint
app.get('/', (req, res) => res.send("API UP AND RUNNING"))

// Define and access routes
// users
app.use('/api/users', require('./routes/api/users'))
// posts
app.use('/api/posts', require('./routes/api/posts'))
// auth
app.use('/api/auth', require('./routes/api/auth'))
// profile
app.use('/api/profile', require('./routes/api/profile'))

// create the port
const PORT = process.env.PORT || 6000

// start server
app.listen(PORT, ()=> {
    console.log(`Application running on Port ${PORT}`)
})