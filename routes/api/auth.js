const express = require('express')
const router = express.Router()

// should be private
router.get('/', (req, res) => res.send('Auth route'))

module.exports = router  