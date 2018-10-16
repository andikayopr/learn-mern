const express = require('express');

const router = express.Router();

// @router 	GET api/user/test
// @desc 	Just testing
// @access	Public
router.get('/test', (req, res) => res.json({info: "It works!"}));

module.exports = router;