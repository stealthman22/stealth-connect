const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const authentication = require('../../middleware/authentication')
const User = require('../../models/User')
const {check, validationResult} = require('express-validator')
const config = require('../../config/default.json')

// should be private
router.get('/', authentication,  async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (err) {
        console.error(err.message)
        res.status(500).json({msg: 'Server Error'})
    } 
})

// @route POST api/auth
// @desc Authenticate and log user in
// @access Public : 
router.post('/', [check('email', 'Please enter a valid Email').isEmail(), check('password', 'Password is required').exists()],
async (req, res) => {
    // check for erorrs in the body of request
   const errors = validationResult(req)
   if(!errors.isEmpty()) {
       return res.status(400).json({errors: errors.array()})
   }

   const { email, password} = req.body

try {
    // check if user exist
    let user = await User.findOne({email:email})
    if(user) {
        return res.status(400).json({errors: [{msg:'Invalid credentials'}]})
    }
    // return jwt
    const payload = await {
        user: {
            id: user.id
        }
    }
    // jwt config
    jwt.sign(payload, config.get('jwtSecret'), {expiresIn:36000}, (err, token) => {
        if(err) throw err
    res.json(token)
    })
} catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
}
}
)

module.exports = router  