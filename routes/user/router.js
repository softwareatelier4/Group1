/** @module category/router */
'use strict';

const express = require('express');
const router = express.Router();
const middleware =  require('../middleware');
const utils = require('../utils');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const User = mongoose.model('User');
const Freelance = mongoose.model('Freelance');

// Supported methods.
router.all('/', middleware.supportedMethods('POST, OPTIONS'));
router.all('/:username', middleware.supportedMethods('GET, PUT, OPTIONS'));

// GET user/:username
router.get('/:username', function(req, res, next) {
  User.findOne({ username : req.params.username }).select("-password").exec(function(err, user){
    if (err) {
      res.status(400).json(utils.formatErrorMessage(err));
    } else if (!user) {
      res.status(404).json({
        statusCode: 404,
        message: "Not Found",
      });
    } else {
      let found = Object.create(user);
      res.status(200).json(found).end();
    }
  });
});


// POST /user
router.post('/', function(req, res, next) {
  const newUser = new User(req.body);
  utils.checkUsername(req.body, function(ok) {
    if (!ok) {
      let err = {
        "message" : "Existing username",
        "errors" : {
          "1" : {
            "message" : "Username `" + req.body.username + "` is already in use.",
          },
        },
      }
      res.status(409).json(utils.formatErrorMessage(err));

    }
    else {
      newUser.save(function(err, saved) {
        if (err) {
          res.status(400).json(utils.formatErrorMessage(err));
        }
        else {
          let createdUser = Object.create(saved);
          createdUser.password = undefined;
          res.status(201).json(createdUser);
        }
      });
    }
  });
});

// PUT /user/:username
router.put('/:username', function(req, res, next) {
  User.findOne({ username : req.params.username }).exec(function(err, user){
    if (err) {
      res.status(400).json(utils.formatErrorMessage(err));
    } else if (!user) {
      res.status(404).json({
        statusCode: 404,
        message: "Not Found",
      });
    } else {
      // Update given fields
      user.username = req.body.username || user.username;
      user.password = req.body.password || user.password;
      user.email = req.body.email || user.email;
      user.freelancer = req.body.freelancer || user.freelancer;
      if (req.body.freelancer) {
        utils.checkFreelancerExistsAndIsNotClaimed(req.body.freelancer, function(exists) {
          if (exists) {
            user.save(function (err, updatedUser) {
              if (err) res.status(400).json(utils.formatErrorMessage(err));

              // update the state of the freelancer
              Freelance.update({ _id: updatedUser.freelancer }, { $set: { state: 'verified' }}, function(err, raw) {
                if (err) res.status(400).json(utils.formatErrorMessage(err));
                res.status(204).end();
              });
            });
          } else {
            res.status(400).end();
          }
        });
      } else {
        user.save(function (err, updated) {
          if (err) res.status(400).json(utils.formatErrorMessage(err));
          res.status(204).end();
        });
      }
    }
  });
});

module.exports = router;
