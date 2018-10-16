const express = require('express');

const router = express.Router();

// @router 	GET api/profile/test
// @desc 	Just testing
// @access	Public
router.get('/test', (req, res) => res.json({info: "Profile Works!"}));

module.exports = router;