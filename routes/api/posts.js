const express = require('express')
const router = express.Router()

// public
router.get('/', (req, res) => res.send('Post route'))
module.exports = router