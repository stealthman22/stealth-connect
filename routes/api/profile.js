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
const {
    company,
    website,
    location,
    bio,
    status,
    githubUsername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin,
} = req.body;

// build profile object
const profileFields = {};
profileFields.user = req.user.id;
if(company) profileFields.company=company;
if(website) profileFields.website = website;
if(location) profileFields.location=location;
if(bio) profileFields.bio=bio;
if(status) profileFields.status=status;
if(githubUsername) profileFields.github=githubUsername;
// for arrays
if(skills) {profileFields.skills = skills.split(',').map(skill => skill.trim())} 
console.log(profileFields.skills);

// build social object
profileFields.social ={};
if(youtube) profileFields.social.youtube = youtube;
if(twitter) profileFields.social.twitter = twitter;
if(facebook) profileFields.social.facebook = facebook;
if(linkedin) profileFields.social.linkedin  = linkedin;
if(instagram) profileFields.social.instagram = instagram;

    try {
        let profile = await  Profile.findOne({user: req.user.id})
        
        // update profile
        if (profile) {
            profile = await Profile.findOneAndUpdate(
                {user: req.user.id},
                 {$set: profileFields}, 
                 {new: true});
                res.json(profile)
        }
        // create profile
         profile = new Profile(profileFields);
        //  save created profile
         await profile.save()
        //  return saved profile
         res.json(profile);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server  Error')
    }
});


module.exports = router;