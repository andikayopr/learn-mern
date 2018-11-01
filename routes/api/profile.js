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

// @router 	GET api/profile
// @desc 	Get current user profile
// @access	Private
router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const errors = {};
        Profile.findOne({ user: req.user.id })
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

module.exports = router;
