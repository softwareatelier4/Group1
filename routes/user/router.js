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
router.all('/', middleware.supportedMethods('GET, POST, OPTIONS'));
router.all('/:username', middleware.supportedMethods('GET, POST, PUT, OPTIONS'));

/**
 * Registration
 *
 * GET /user/register
 * just renders the page
*/
router.get('/register', function(req, res) {
  if(req.session.user_id) { // logged in user
    User.findById(req.session.user_id).exec(function(err, user){
      res.render('register', {
        title: "JobAdvisor",
        logged: true,
        username: user.username,
        userFreelancer: user.freelancer,
      });
    });
  } else {
    res.render('register', {
      title: "JobAdvisor",
      logged: false
    });
  }
});

// End of registration

/**
 * Login and logout
 *
 * POST /user/login
 * `username` and `password` expected in the body
*/
router.post('/login', function(req, res, next) {
  if(req.session.user_id) { // if a session is already open, something is very wrong
    res.sendStatus(409).end();
  } else { // create session
    const password = req.body.password;
    User.findOne({ username : req.body.username }, function(err, foundUser) {
      if (err) res.sendStatus(500).end(); // error
      else if (!foundUser) res.sendStatus(404).end(); // username not found
      else {
        // check password
        if (foundUser.password == password) {
          // start session
          req.session.user_id = foundUser._id;
          res.sendStatus(202).end(); // redirect doen client side
        }
        else res.sendStatus(401).end(); // unauthorised
      }
    });
  }
});

// POST /user/logout
router.get('/logout', function (req, res) {
  if(!req.session.user_id) { // if no session open, something is very wrong
    res.sendStatus(409).end();
  } else { // delete req.session.user_id;
    req.session.destroy(function(err) {
      if(err) {
        console.log(err);
      }
      res.sendStatus(202).end(); // redirect done client side
    });
  }
});

// End of login and logout

// GET user/:username
router.get('/:username', function(req, res, next) {
  User.findOne({ username : req.params.username }).select("-password").exec(function(err, user){ //TODO populate freelancers
    if (err) {
      res.status(400).json(utils.formatErrorMessage(err));
    } else if (!user) {
      res.status(404).json({
        statusCode: 404,
        message: "Not Found",
      });
    } else {
      let found = Object.create(user);
      // distinguish between raw and ajax GET request (to render page or return JSON)
      if (req.headers.ajax) {
        res.status(200).json(found).end();
      } else if (req.accepts('text/html')) {
        if(req.session.user_id) { // logged in user
          // find logged in user
          User.findById(req.session.user_id).exec(function(err, loggedUser){
            res.render('user', {
              title: "JobAdvisor",
              logged: true,
              username: loggedUser.username,
              freelancers: user.freelancers,
            });
          });
        } else { // not logged in
          res.render('user', {
            title: "JobAdvisor",
            logged: false,
            freelancers: user.freelancers,
          });
        }
      } else {
        res.sendStatus(400);
      }
    }
  });
});

/**
 *  GET /user
 *  gets the info of the currently logged in user (based on session)
 *  route used to making it more straightforward to access data from client
 */
router.get('/', function(req, res, next) {
  if(!req.session.user_id) {
    res.status(401).end();
  }

  User.findById(req.session.user_id).select("-password").exec(function(err, user){
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

    } else {
      newUser.save(function(err, saved) {
        if (err) {
          res.status(400).json(utils.formatErrorMessage(err));
        } else {
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
  // cannot put freelancer through this route. Use the /claim route instead.
  if (req.body.freelancer) {
    let err = {
      "message" : "Unsupported action",
      "errors" : {
        "1" : {
          "message" : "Cannot set `freelancer` field of user `" + req.params.username + "` using `PUT /user/:username`.",
        },
      },
    }
    res.status(400).json(utils.formatErrorMessage(err));
  }

  // normal execution
  User.findOne({ username : req.params.username }).exec(function(err, user){
    if (err) {
      res.status(400).json(utils.formatErrorMessage(err));
    } else if (!user) {
      res.status(404).json({
        statusCode: 404,
        message: "Not Found",
      });
    // trying to change username
    } else if (req.body.username && req.body.username !== user.username) {
      utils.checkUsername({ username : req.body.username }, function(ok) {
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
        } else {
          // Update given fields (not freelancer)
          user.username = req.body.username || user.username;
          user.password = req.body.password || user.password;
          user.email = req.body.email || user.email;

          // save
          user.save(function (err, updated) {
            if (err) res.status(400).json(utils.formatErrorMessage(err));
            res.status(204).end();
          });
        }
      });
    // update of password or email
    } else {
      // Update given fields (not freelancer, not username because it would be done above)
      user.password = req.body.password || user.password;
      user.email = req.body.email || user.email;

      // save
      user.save(function (err, updated) {
        if (err) res.status(400).json(utils.formatErrorMessage(err));
        res.status(204).end();
      });
    }
  });
});

module.exports = router;
