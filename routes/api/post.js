const express = require('express')
const router = express.Router()
const {check, validationResult} = require('express-validator');

//  middleware(s)
const auth = require('../../middleware/authentication');

// Models
const User = require('../../models/User');
const Post = require('../../models/Post')

// @route  Post api/post
// @desc   Create a Post
// @access  Private
router.post('/', auth,
check('text', 'Text is required').not().isEmpty(),
async (req, res) => {
const errors = validationResult(req);
if (!errors.isEmpty()) {
return res.status(400).json({errors: errors.array()})
}

try {
 const user =  await User.findById(req.user.id).select('-password');

 const newPost = new Post({
  text: req.body.text,
  user: req.user.id,
  name: user.name,
  avatar: user.avatar,
 })
// Save post to db after creating it
 const post = await newPost.save();

// return it to application
 return res.json(post)
} catch (error) {
 console.error(error.message);
 res.status(500).send('This is our fault not yours')
}
})
module.exports = router