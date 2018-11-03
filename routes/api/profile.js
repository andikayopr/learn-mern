const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Profile Model
const Profile = require('../../models/Profile');
// Load User Profile
const User = require('../../models/User');
// Load Profile Validation
const validateProfileInput = require('../../validation/main/profile');
const validateExpInput = require('../../validation/main/experience');
const validateEduInput = require('../../validation/main/education');

// @router 	GET api/profile
// @desc 	Get current user profile
// @access	Private
router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const errors = {};
        Profile.findOne({ user: req.user.id })
            .populate('user', ['name', 'avatar'])
            .then(profile => {
                if (!profile) {
                    errors.no_profile = 'There is no profile for this user';
                    return res.status(404).json(errors);
                }
                res.json(profile);
            })
            .catch(err => res.status(404).json(err));
    }
);

// @router 	GET api/profile/handle:handle
// @desc 	Get profile by handle
// @access	Public
router.get('/handle/:handle', (req, res) => {
    const errors = {};
    Profile.findOne({ handle: req.params.handle })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.no_profile = "There's no profile for this user";
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

// @router 	GET api/profile/user:user_id
// @desc 	Get profile by user ID
// @access	Public
router.get('/user/:user_id', (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.params.user_id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.no_profile = "There's no profile for this user";
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err =>
            res
                .status(404)
                .json({ profile: 'There is no profile for this user' })
        );
});

// @router 	GET api/profile/all
// @desc 	Get all profiles
// @access	Public
router.get('/all', (req, res) => {
    const errors = {};
    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.no_profile = 'There are no profiles';
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err =>
            res.status(404).json({ profile: 'There are no profiles' })
        );
});

// @router 	POST api/profile
// @desc 	Create user profile
// @access	Private
router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validateProfileInput(req.body);

        // Check
        if (!isValid) {
            return res.status(400).json(errors);
        }

        // Get fields
        const profileFields = {};
        profileFields.user = req.user.id;
        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.company) profileFields.company = req.body.company;
        if (req.body.website) profileFields.website = req.body.website;
        if (req.body.location) profileFields.location = req.body.location;
        if (req.body.bio) profileFields.bio = req.body.bio;
        if (req.body.github_uname)
            profileFields.github_uname = req.body.github_uname;

        if (typeof req.body.skills !== 'undefined') {
            profileFields.skills = req.body.skills.split(',');
        }

        profileFields.social = {};
        if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
        if (req.body.instagram)
            profileFields.social.instagram = req.body.instagram;
        if (req.body.linkedin)
            profileFields.social.linkedin = req.body.linkedin;
        if (req.body.facebook)
            profileFields.social.facebook = req.body.facebook;
        if (req.body.twitter) profileFields.social.twitter = req.body.twitter;

        Profile.findOne({ user: req.user.id }).then(profile => {
            if (profile) {
                // Update profile
                Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                ).then(profile => res.json(profile));
            } else {
                // Create profile
                // Check if exist
                Profile.findOne({ handle: profileFields.handle }).then(
                    profile => {
                        if (profile) {
                            errors.handle = 'Handle already exist';
                            res.status(400).json(errors);
                        }

                        // Save Profile
                        new Profile(profileFields)
                            .save()
                            .then(profile => res.json(profile));
                    }
                );
            }
        });
    }
);

// @router 	POST api/profile/experience
// @desc 	Add experience to profile
// @access	Private
router.post(
    '/experience',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validateExpInput(req.body);
        // Check
        if (!isValid) {
            return res.status(400).json(errors);
        }

        Profile.findOne({ user: req.user.id }).then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                date_from: req.body.date_from,
                date_to: req.body.date_to,
                current: req.body.current,
                description: req.body.description
            };

            // Add experience to array
            profile.experience.unshift(newExp);
            profile.save().then(profile => res.json(profile));
        });
    }
);

// @router  POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post(
    '/education',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validateEduInput(req.body);
        // Check
        if (!isValid) {
            return res.status(400).json(errors);
        }

        Profile.findOne({ user: req.user.id }).then(profile => {
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                field_study: req.body.field_study,
                date_from: req.body.date_from,
                date_to: req.body.date_to,
                current: req.body.current,
                description: req.body.description
            };

            // Add Education to array
            profile.education.unshift(newEdu);
            profile.save().then(profile => res.json(profile));
        });
    }
);

module.exports = router;
