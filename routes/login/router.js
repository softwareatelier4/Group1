/** @module login/router */
'use strict';

var express = require('express');
var router = express.Router();
var middleware =  require('../middleware');
const utils = require('../utils');
var mongoose = require('mongoose');
const User = mongoose.model('User');

// Supported methods.
router.all('/', middleware.supportedMethods('POST, OPTIONS'));

// POST login/:username
router.post('/:username', function(req, res, next) {
  const password = req.body.password;
  User.findOne({ username : req.params.username }, function(err, foundUser) {
    if (err) res.sendStatus(500).end(); // error
    else if (!foundUser) res.sendStatus(404).end(); // username not found
    else {
      // check password
      if (foundUser.password == password) {
        // create session TODO
        res.sendStatus(200).end();
      }
      else res.sendStatus(401).end(); // unauthorised
    }
  });
});

module.exports = router;
