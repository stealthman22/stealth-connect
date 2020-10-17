//  call in mongoose
const mongoose = require('mongoose')
// create config car
const config = require('config')
// create db connection
const db = config.get('mongoURI')

// set promise
// mongoose.Promise = global.Promise

const connectDB= async() => { 
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true  

        })
        console.log('MongoDB Connected...')
    } catch (err) {
console.error(err.message)
// let the app fail gracefully
process.exit(1 )
    }
}

module.exports = connectDB