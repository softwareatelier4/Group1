/** @module freelance/router */
'use strict';

const express = require('express');
const router = express.Router();
const middleware =  require('../middleware');
const utils = require('../utils');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Freelance = mongoose.model('Freelance');
const Review = mongoose.model('Review');
const User = mongoose.model('User');

// Supported methods.
router.all('/', middleware.supportedMethods('GET, POST, PUT, OPTIONS'));
router.all('/new', middleware.supportedMethods('GET, OPTIONS')); //add delete later
router.all('/:freelanceid', middleware.supportedMethods('GET, PUT, OPTIONS')); //add delete later

// GET /freelance/new
router.get('/new', function(req, res, next) {
  if (req.accepts('text/html')) {
    if(req.session.user_id) {
       User.findById(req.session.user_id).exec(function(err, user){
        res.render('freelancer-create', {
          title: "JobAdvisor - Create Freelancer Profile" ,
          logged: true,
          username: user.username,
          userFreelancer: user.freelancer,
          claiming: user.claiming
        });
      });
    } else {
      res.render('freelancer-create', {
        title: "JobAdvisor - Create Freelancer Profile" ,
        logged: false
      });
    }

  } else res.sendStatus(400);
});

//'reviews tags category reviews.reply'
// GET freelance/:freelanceid
router.get('/:freelanceid', function(req, res, next) {

  if (ObjectId.isValid(req.params.freelanceid)) {
    // distinguish between raw and ajax GET request (to render page or return JSON)
    if(req.headers.ajax) {
      Freelance.findById(req.params.freelanceid).populate({
        path: 'reviews',
        populate: {
          path: 'reply',
          model: 'Review',
        }
      }).populate('tags category').exec(function(err, freelance) {
        if (err) {
          res.status(400).json(utils.formatErrorMessage(err));
        } else if (!freelance) {
          res.status(404).json({
            statusCode: 404,
            message: "Not Found",
          });
        } else {
          utils.addLinks(freelance, "freelance");
          res.json(freelance).end();
        }
      });
    } else if (req.accepts('text/html')) {
      if(req.session.user_id) { // logged in user
        User.findById(req.session.user_id).exec(function(err, user){
          res.render('freelancer', {
    				title: "JobAdvisor",
            logged: true,
            username: user.username,
    			});
        });
      } else {
        res.render('freelancer', {
  				title: "JobAdvisor",
          logged: false
  			});
      }
    } else res.sendStatus(400);
  } else res.sendStatus(400);
});

// POST freelance/:freelanceid/review/:replyingid
router.post('/:freelanceid/review', function(req, res, next) {
  const newReview = new Review(req.body);
  if (ObjectId.isValid(req.params.freelanceid)) {
    if (newReview.reply) {
      // newReview is a reply, so add it to the database as a review and put it into the corresponding review
      Review.findById(newReview.reply).exec(function(err, review) {
        if (err) return next(err);
        if (!review) {
          res.status(404).json({
            message: "Trying to reply to a non-existent review."
          });
        } else {
          newReview.reply = undefined;
          newReview.save(function(err, saved) {
            if (err) {
              res.status(400).json(utils.formatErrorMessage(err));
            } else {
              review.reply = newReview;
              review.save(function(err, saved) {
                if (err) {
                  res.status(400).json({
                    message: "Could not save Review in Freelance."
                  });
                } else {
                  res.status(201).json(saved);
                }
              })
            }
          })
        }
      })
    } else {
      Freelance.findById(req.params.freelanceid).exec(function(err, freelance) {
      if (err) return next(err);
      if (!freelance) {
        res.status(404).json({
          message: "Freelance not found with the given id."
        });
      } else {
        // newReview is a review, therefore add a new review to the database and to the array of reviews of the corresponding freelance
        newReview.save(function(err, saved) {
          if (err) {
            res.status(400).json(utils.formatErrorMessage(err));
          } else {
            // res.status(201).json(saved);
            freelance.reviews.push(newReview);
            freelance.save(function(err, saved) {
              if (err) {
                res.status(400).json({
                  message: "Could not save Review in Freelance."
                });
              } else {
                res.status(201).json(saved);
              }
            });
          }
        });
      }
    });
    }
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
