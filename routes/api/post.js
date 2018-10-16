const express = require('express');

const router = express.Router();

// @router 	GET api/post/test
// @desc 	Just testing
// @access	Public
router.get('/test', (req, res) => res.json({info: "Post Works!"}));

module.exports = router;