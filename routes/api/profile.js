const express = require('express');
const router =express.Router();
const auth = require('../../middleware/authentication');

const Profile = require('../../models/Profile');
const User = require('../../models/User')


// @route   Get api/profile/me
// @desc    Get user profile
// @access  Private : (do we need an authentication for this route)


router.get('/me', auth,  async (req, res) => {
try {
    // getting info with the populate method 
    const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar']);

    // check if no profile
    if(!profile) {
        return res.status(400).json({msg:'There is no profile for this user'});
    };
    res.json(profile)
} catch (error) {
    console.error(error.message)
    res.status(500).json({msg:'Server Error'})
}
});

module.exports = router