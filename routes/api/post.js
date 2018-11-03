const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const router = express.Router();
// Load Model
const Post = require('../../models/Post');

// Load Validation
const validatePostInput = require('../../validation/main/post');

// @router 	GET api/post/test
// @desc 	Just testing
// @access	Public
router.get('/test', (req, res) => res.json({ info: 'Post Works!' }));

// @router 	POST api/post
// @desc 	Create a post (article)
// @access	Private
router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validatePostInput(req.body);

        // Check Validation
        if (!isValid) {
            // If any errors, send 400 with error objects
            return res.status(400).json(errors);
        }

        const newPost = new Post({
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.user.id
        });

        newPost.save().then(post => res.json(post));
    }
);

module.exports = router;
