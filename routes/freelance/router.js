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

router.get('/edit', function(req, res) {
  if (req.accepts('text/html')) {
    if(req.session.user_id) {
       User.findById(req.session.user_id).exec(function(err, user){
         if (err) {
           res.status(500).json({ error : 'error finding user in database' });
         } else if (!user) {
           res.status(404).json({ error : 'user not found' });
         } else if (user.freelancer != req.query.freelancer) {
           res.redirect('/');
         } else {
           res.render('freelancer-edit', {
             title: "JobAdvisor - Edit Freelancer Profile" ,
             logged: true,
             username: user.username,
             userFreelancer: user.freelancer,
             claiming: user.claiming
           });
         }
      });
    } else {
      // TODO remove, commented for testing
      // res.render('freelancer-edit', {
      //   title: "JobAdvisor - Edit Freelancer Profile" ,
      //   logged: false
      // });
      res.render('freelancer-edit', {
        title: "JobAdvisor - Edit Freelancer Profile" ,
        logged: true,
        username: "MrSatan",
        userFreelancer: "58cc4942fc13ae612c000023"
      });

    }

  } else res.sendStatus(400);
});

// GET freelance/:freelanceid
router.get('/:freelanceid', function(req, res, next) {

  if (ObjectId.isValid(req.params.freelanceid)) {
    // distinguish between raw and ajax GET request (to render page or return JSON)
    if(req.headers.ajax) {
      Freelance.findById(req.params.freelanceid).populate('reviews tags category').exec(function(err, freelance){
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
