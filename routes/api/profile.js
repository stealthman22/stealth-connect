const express = require('express');
const router =express.Router();
const request = require('request');
const config = require('config')
const auth = require('../../middleware/authentication');
const {check, validatorResult, validationResult} = require('express-validator');


const Profile = require('../../models/Profile');
const User = require('../../models/User')


// @route   Get api/profile/me
// @desc    Get  current user profile
// @access  Private : ( we need an authentication for this route i.e sending in a token) 
router.get('/me', auth,  async (req, res) => {
try {
    // getting info with the populate method 
        
    const profile = await Profile.findOne({user:req.user.id})
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
if(skills) {
    profileFields.skills = skills.split(',').map(skill => skill.trim());
} 
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
                 {new: true},
                 );
                 return res.json(profile)
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


// @route   DELETE api/profile/me
// @desc    Delete a profile, user and posts.
// @access  Private 
router.delete('/',  auth, async (req, res) => {
    try {
        // @todo remove users posts
    
// delete a profile
await  Profile.findOneAndRemove({user: req.user.id});

// delete a user
await User.findOneAndRemove({_id: req.user.id});

res.json({msg: 'User deleted'});
    } catch (error) {
        
    }

} )

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put('/experience', [auth, 
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()],

    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
    // destructure the req 
    const {title, company, from, to, current,  description} = req.body;

    // add new experience
    const newExp = {
        title, company, from, to, current,  description
    }

    try {
        const profile = await Profile.findOne({user: req.user.id});

        profile.experience.unshift(newExp);
        await profile.save()

       return res.json(profile)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}
)


// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete  profile experience
// @access  Private
router.delete('/experience/:exp_id',  auth, async (req, res) => {
try {
    const profile = await Profile.findOne({user: req.user.id});

        // Get remove index to delete profile
        const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);
            // take it out
            // splice mutates the array
            profile.experience.splice(removeIndex, 1)
            // save modified profile
            await profile.save()
            // return modified profile
            return res.json(profile)
} catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
}
});


// @route   PUT api/profile/education
// @desc    Add profile education
// @access  Private
router.put('/education', [auth, 
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldOfStudy', 'Field of study is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()],

    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
    // destructure the req 
    const {school, degree, fieldOfStudy, location, from, to, current,  description} = req.body;

    // add new experience
    const newEdu = {
    school, degree, fieldOfStudy, location, from, to, current,  description
    }

    try {
        const profile = await Profile.findOne({user: req.user.id});

        profile.education.unshift(newEdu);
        await profile.save()

       return res.json(profile)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
}
)


// @route   DELETE api/profile/education/:edu_id
// @desc    Delete  profile education
// @access  Private
router.delete('/education/:edu_id',  auth, async (req, res) => {
try {
    const profile = await Profile.findOne({user: req.user.id});

        // Get remove index to delete profile
        const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(req.params.edu_id);
            // take it out
            // splice mutates the array
            profile.education.splice(removeIndex, 1)
            // save modified profile
            await profile.save()
            // return modified profile
            return res.json(profile)
} catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
}
});





// @route   GET api/profile/github
// @desc   Get github repos from Github
// @access  Public
router.get('/github/:username', (req, res) => {
    try {
        // Build github options object
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=4&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: {'user-agent': 'node.js'}
        };
        // make the request using request package
        request(options, (error, response, body) => {
            if(error) console.error(error);
            if(response.statusCode !== 200) {
                // always add return to front end errors
                return   res.status(404).json({msg: "No Github Profile found"})
            }
            // if all goes well
           res.json(JSON.parse(body))
        })
    } catch (error) {
       console.error(error.message);
       res.status(500).send('Server Error') 
    }
})

module.exports = router;