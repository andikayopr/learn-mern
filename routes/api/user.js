const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load input validation
const validateRegisterInput = require('../../validation/main/register');
const validateLoginInput = require('../../validation/main/login');

// Load User Model
const User = require('../../models/User');

// @router 	GET api/user/test
// @desc 		Just testing
// @access	Public
router.get('/test', (req, res) => res.json({ info: 'It works!' }));

// @router 	POST api/user/register
// @desc 		Registering User
// @access	Public
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            errors.email = 'Email already exist!';
            return res.status(400).json(errors);
        } else {
            const avatar = gravatar.url(req.body.email, {
                s: '200', // Size
                r: 'pg', // Rating
                d: 'mm' // Default
            });

            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser
                        .save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                });
            });
        }
    });
});

// @router 	POST api/user/login
// @desc 		Login User / Returning JWT Token
// @access	Public
router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    // Check
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    User.findOne({ email }).then(user => {
        // Check for user
        if (!user) {
            return res.status(404).json({ email: 'User is not found!' });
        }

        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched
                const payload = {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar
                }; // Create JWT Payload

                // Sign token
                jwt.sign(
                    payload,
                    keys.secretKey,
                    { expiresIn: 3600 },
                    (err, token) => {
                        res.json({
                            success: true,
                            token: 'Bearer ' + token
                        });
                    }
                );
            } else {
                return res
                    .status(400)
                    .json({ password: 'Password incorrect!' });
            }
        });
    });
});

// @router 	GET api/user/active
// @desc 		Return current active user
// @access	Private
router.get(
    '/active',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        });
    }
);

module.exports = router;
