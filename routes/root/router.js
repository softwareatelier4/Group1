/** @module root/router */
'use strict';

const express = require('express');
const router = express.Router();
const middleware =  require('../middleware');
const rootUrl = require("../../config").url;
const mongoose = require('mongoose');
const User = mongoose.model('User');

// supported methods
router.all('/', middleware.supportedMethods('GET, OPTIONS'));

// list users
router.get('/', function(req, res, next) {
  if (req.accepts('text/html')) {
    if(req.session.user_id) { // logged in user
      User.findById(req.session.user_id).exec(function(err, user){
        res.render('index', {
          title: "JobAdvisor",
          logged: true,
          username: user.username,
          userFreelancer: user.freelancer[0], // TODO link to list of freelancers
        });
      });
    } else { // not logged in
      res.render('index', {
        title: "JobAdvisor",
        logged: false
      });
    }
  }
  else {
    res.sendStatus(404);
  }
});

/** router for root */
module.exports = router;
