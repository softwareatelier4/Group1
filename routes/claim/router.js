'use strict';

var express = require('express');
var router = express.Router();
var middleware =  require('../middleware');
const utils = require('../utils');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
const Freelance = mongoose.model('Freelance');
const Review = mongoose.model('Review');

// Supported methods.
router.all('/', middleware.supportedMethods('GET, POST, PUT, OPTIONS'));
router.all('/new', middleware.supportedMethods('GET, OPTIONS')); //add delete later
router.all('/:freelanceid', middleware.supportedMethods('GET, PUT, OPTIONS')); //add delete later

router.get('/:freelanceid', function(req, res) {
  console.log('ABC');
  if (req.accepts('text/html')) {
    res.render('claim', {
      title: "JobAdvisor",
    });
  }
  else {
    res.sendStatus(404);
  }
});


module.exports = router;
