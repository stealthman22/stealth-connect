const express = require('express')
const router = express.Router()
const authentication = require('../../middleware/authentication')
const User = require('../../models/User')
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

module.exports = router  