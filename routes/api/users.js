const express = require('express')
const router = express.Router()
//  to use express validators
const {check, validationResult} = require('express-validator')

// create a route
// @route GET api/users
// @desc Register route
// @access Public : if auth token will be needed or not
// validation check is in an array
// checking if its not there, and not empty at the same time
router.post('/', [check('name', 'You must enter a Name').not().isEmpty(),check('email', 'Please enter a valid Email').isEmail(), check('password', 'Please enter a Password of not less than 6 characters').isLength({min:6})], (req, res) => {
   const errors = validationResult(req)
   if(!errors.isEmpty()) {
    //    array method sends the error to the UI
return res.status(400).json({errors: errors.array()})
   } 
   res.send('User route')
})

module.exports = router