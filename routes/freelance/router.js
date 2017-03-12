/** @module freelance/router */
'use strict';

var express = require('express');
var router = express.Router();
var middleware =  require('../middleware');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var rootUrl = require("../../config").url;
const Freelance = mongoose.model('Freelance');

// Supported methods.
router.all('/', middleware.supportedMethods('GET, POST, PUT, OPTIONS'));
router.all('/:freelanceid', middleware.supportedMethods('GET, PUT, OPTIONS')); //add delete later

// GET:freelanceid
router.get('/:freelanceid', function(req, res, next) {
  Freelance.findById(req.params.freelanceid).lean().exec(function(err, freelance){
    if (err) {
      res.status(500).end();
    }
    else if (!freelance) {
      res.status(404)
      .json({
        statusCode: 404,
        message: "Not Found",
      })
      .end();
    }
    else {
      addLinks(freelance);
      res.json(freelance).end();
    }
  });
});

// POST
router.post('/', function(req, res, next) {
  const newFreelance = new Freelance(req.body);
  newFreelance.save(function(err, saved) {
    if (err) {
      res.status(400).json(formatErrorMessage(err));
    }
    res.json(saved);
  })
});

// Create JSON error message in case mongoose fails.
function formatErrorMessage(err) {
  let reason = err.message;
  let errorKeys = Object.keys(err.errors);
  let errorJSON = { "reason" : reason };
  let errors = [];
  for (let error of errorKeys) {
    errors.push(err.errors[error].message);
  }
  errorJSON.errors = errors;
  return errorJSON;
}

//add self link to returned freelance
function addLinks(freelance){
  freelance.links = [
    {
      "rel" : "self",
      "href" : rootUrl + "/freelance/" + freelance._id
    }
  ];
}

module.exports = router;
