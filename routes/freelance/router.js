/** @module freelance/router */
'use strict';

var express = require('express');
var router = express.Router();
var middleware =  require('../middleware');
const utils = require('../utils');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
const Freelance = mongoose.model('Freelance');

// Supported methods.
router.all('/', middleware.supportedMethods('GET, POST, PUT, OPTIONS'));
router.all('/:freelanceid', middleware.supportedMethods('GET, PUT, OPTIONS')); //add delete later

// GET:freelanceid
router.get('/:freelanceid', function(req, res, next) {
  if (ObjectId.isValid(req.params.freelanceid)) {
    Freelance.findById(req.params.freelanceid).lean().exec(function(err, freelance){
      if (err) {
        res.status(400).json(utils.formatErrorMessage(err));
      }
      else if (!freelance) {
        res.status(404).json({
          statusCode: 404,
          message: "Not Found",
        });
      }
      else {
        utils.addLinks(freelance, "freelance");
        res.json(freelance).end();
      }
    });
  }
  else res.sendStatus(400);
});

// POST
router.post('/', function(req, res, next) {
  const newFreelance = new Freelance(req.body);
  newFreelance.save(function(err, saved) {
    if (err) {
      res.status(400).json(utils.formatErrorMessage(err));
    }
    res.status(201).json(saved);
  })
});

module.exports = router;
