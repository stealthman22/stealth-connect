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



// @route  Post api/post
// @desc   Get all  Posts
// @access  Private
router.get('/', auth, async(req, res) => {
 try {
  // sort posts from most recent
  const posts = await Post.find().sort({date: -1})
   res.send(posts)
 } catch (error) {
  console.error(error.message);
  res.status(500).send('This is our fault, not yours')
 }
})

// @route  Post api/posts/:id
// @desc   Get  Posts by specific user
// @access  Private
router.get('/:id', auth, async (req, res) => {
 try {
  // sort posts from most recent
  const post = await Post.findById(req.params.id).sort({date: -1})
  
  // check if posts exists
  if(!post) {
    res.status(404).json({msg: 'There are no posts for this user'})
  }
  res.json(post)
 } catch (error) {
  console.error(error.message);
  if(error.kind === 'ObjectId') {
   return res.status(404).json({msg: 'There is no such user'})
  }
  res.status(500).send('This is our fault, not yours')
 }
})

// @route  Post api/post
// @desc  Delete a  Post
// @access  Private
router.delete('/:id', auth, async(req, res) => {
 try {
  // sort posts from most recent
  const post = await Post.findById(req.params.id)

  // if post doesn't exist
  if(!post) {
   return res.status(404).json({msg: 'Post not found'})
  }

  // check user
  // change post.user to a string else it will never match
  if(post.user.toString() !== req.user.id) {
return res.status(401).json({msg:'You are not authorized'})
  }
await post.remove()
res.json({msg: 'Post removed'})
   res.json(post)
 } catch (error) {
  console.error(error.message);
  if(error.kind === 'ObjectId') {
   return res.status(404).json({msg: 'Post not found'})
  }
  res.status(500).send('This is our fault, not yours')
 }
})


// @route  Post api/post/like/:id
// @desc  Add like to a Post
// @access  Private
router.put('/like/:id', auth, async(req, res) => {
 try {
  const post = await Post.findById(req.params.id);

  // check if post has already been liked by user
 if(post.likes.some(like => 
  like.user.toString() === req.user.id).length > 0) {
  return res.status(400).json({msg: 'You have already liked this post'})
 }

 // else add like to likes array
 post.likes.unshift({user: req.user.id});

 await post.save();

 // return updated likes array
 res.json(post.likes)
 } catch (error) {
  console.error(error.message);
  res.status(500)('This is our fault not yours')
 }
})


// @route  Post api/post/like/:id
// @desc  Remove like from a Post
// @access  Private
router.put('/unlike/:id', auth, async(req, res) => {
 try {
  const post = await Post.findById(req.params.id);

  // check if post has never been liked by user
 if(post.likes.some(like => 
  like.user.toString() === req.user.id).length === 0) {
  return res.status(400).json({msg: 'You have not liked this post'})
 }

 // Get remove index
 //  grab the index of the like
 const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

 // remove the like
 post.likes.splice(removeIndex, 1);

 await post.save();

 // return updated likes array
 res.json(post.likes)
 } catch (error) {
  console.error(error.message);
  res.status(500)('This is our fault not yours')
 }
})


// @route  Post api/post/comment/:id
// @desc   Comment on a post 
// @access  Private
router.post('/comment/:id', auth,
check('text', 'Text is required').not().isEmpty(),
async (req, res) => {
const errors = validationResult(req);
if (!errors.isEmpty()) {
return res.status(400).json({errors: errors.array()})
}

try {
 const user =  await User.findById(req.user.id).select('-password');

//  find post being commented on
const post = await Post.findById(req.params.id);

// Create new comment
 const newComment =  {
  text: req.body.text,
  user: req.user.id,
  name: user.name,
  avatar: user.avatar,
 };

// Add new comment
post.comments.unshift(newComment);

// Save post to db after creating it
  await post.save();
 
// return the comment array for that post
 return res.json(post.comments)
} catch (error) {
 console.error(error.message);
 res.status(500).send('This is our fault not yours')
}
})


module.exports = router