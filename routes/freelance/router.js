/** @module freelance/router */
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
router.all('/:freelanceid', middleware.supportedMethods('GET, PUT, OPTIONS')); //add delete later

// GET freelance/:freelanceid
router.get('/:freelanceid', function(req, res, next) {

  if (ObjectId.isValid(req.params.freelanceid)) {
    // distinguish between raw and ajax GET request (to render page or return JSON)
    if(req.headers.ajax) {
      Freelance.findById(req.params.freelanceid).populate('reviews').populate('tags').populate('category').exec(function(err, freelance){
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
    } else {
      if (req.accepts('text/html')) {
        res.render('freelancer', {
          title: "JobAdvisor" ,
        });
      }
    }
  } else res.sendStatus(404);
});

// POST freelance/:freelanceid/review
router.post('/:freelanceid/review', function(req, res, next) {
  const newReview = new Review(req.body);
  if (ObjectId.isValid(req.params.freelanceid)) {
    Freelance.findById(req.params.freelanceid).exec(function(err, freelance) {
      if (err) return next(err);
      if (!freelance) {
        res.status(404).json({
          message: "Freelance not found with the given id."
        });
      } else {
        freelance.reviews.push(newReview);
        freelance.save(function(err, saved) {
          if (err) {
            res.status(400).json({
              message: "Could not save Review to in Freelance."
            });
          } else {
            newReview.save(function(err, saved) {
              if (err) {
                res.status(400).json(utils.formatErrorMessage(err));
              } else {
                res.status(201).json(saved);
              }
            });
          }
        });
      }
    });
  } else {
    res.sendStatus(400);
  }
});

// POST freelance/
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
