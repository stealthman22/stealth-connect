const express = require('express');
const router =express.Router();
const auth = require('../../middleware/authentication');
const {check, validatorResult, validationResult} = require('express-validator')

const Profile = require('../../models/Profile');
const User = require('../../models/User')


// @route   Get api/profile/me
// @desc    Get user profile
// @access  Private : ( we need an authentication for this route i.e sending in a token)


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

module.exports = router;

// @route   Get api/profile/
// @desc    Create user profile
// @access  Private 

router.post('/', auth, [check('status', 'This field is required').not().isEmpty(),
check('skills', 'This field is required').not().isEmpty()],
async (req, res) => {
    const errors= validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors:errors.array()})
    };
    // profile creation logic

    res.send('Profile created, ensure to update all fields')

});
