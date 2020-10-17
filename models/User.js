const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    // unique stops people from registering with same email
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: { 
        type: String,
        required: true
     },
     avatar: {
         type: String,
     },
     date: {
         type: Date,
         default: Date.now
     }
})

module.exports = User = mongoose.model('user', UserSchema)