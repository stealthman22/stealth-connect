const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
//  to use express validators
const {check, validationResult} = require('express-validator')
// create a route
// @route GET api/users
// @desc Register route
// @access Public : if auth token will be needed or not
// validation check is in an array
// checking if its not there, and not empty at the same time
router.post('/', [check('name', 'You must enter a Name').not().isEmpty(),check('email', 'Please enter a valid Email').isEmail(), check('password', 'Please enter a Password of not less than 6 characters').isLength({min:6})], 
async (req, res) => {
   const errors = validationResult(req)
   if(!errors.isEmpty()) {
    //    array method sends the error to the UI
return res.status(400).json({errors: errors.array()})
   }  // User registration logic
const {name, email, password, } = req.body
try {
   // 1 See if user exist
   let user = await User.findOne({email:email})
   if(user) {
      // match the error that will be provided by val check error array above
      return res.status(400).json({errors: [{msg: 'User already exists'}]})
   }
// 2 Get user's gravatar
const avatar = gravatar.url(email, {
   // default size
   s:'200',
   // rating 
   r: 'pg',
   // default icon
   d: 'mm'
})
// create new user using mongoose
user = new User({
   name : name,
   email : email,
   avatar: avatar,
   password:password
})
// 3 Encrypt password
const salt = await bcrypt.genSalt(10)
user.password = await bcrypt.hash(password, salt)
// save the new user
user.save()

// 4 Return jwt 
res.send('User registered')
} catch (err) {
   console.error(err.message)
   res.status(500).send('Server  Error')
}



})

module.exports = router