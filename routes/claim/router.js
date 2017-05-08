'use strict';

var express = require('express');
var router = express.Router();
var middleware =  require('../middleware');
const utils = require('../utils');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
const Freelance = mongoose.model('Freelance');
const User = mongoose.model('User');
const Claim = mongoose.model('Claim');
const multer = require('multer');
const fs = require('fs');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // create claims folder
    if (!fs.existsSync('public/claims/')) {
      fs.mkdirSync('public/claims/');
    }

    let dest = `public/claims/${req.body.claimid}/`;
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    cb(null, dest)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

var upload = multer({ storage : storage });

// Supported methods.
router.all('/', middleware.supportedMethods('GET, POST, OPTIONS'));
router.all('/upload', middleware.supportedMethods('POST, OPTIONS'));
router.all('/new', middleware.supportedMethods('POST, OPTIONS'));

router.post('/upload', upload.array('idfile'), function(req, res) {
  res.sendStatus(202);
});

router.post('/uploadopt', upload.array('idfileopt'), function(req, res) {
  res.sendStatus(202);
});

// Note: statuses 451, 452 and 453 are needed for error identification on front-end
// This way, specific error messages can be displayed
router.post('/new', function(req, res) {
  if (!req.session.user_id || !req.body.freelancerId) {
    res.status(451).json({ error : 'no user id or freelancer id' }); // TESTED
  } else {
    User.findById(req.session.user_id, function(err, user) {
      if (err) {
        res.status(500).json({ error : 'database error while finding user' }); // TODO: TEST
      } else if (!user) {
        res.status(404).json({ error : 'user not found' });  // TODO: TEST
      } else if (user.freelancer) {
        res.status(452).json({ error : 'user id already claiming' }); // TESTED
      } else {
        Freelance.findById(req.body.freelancerId, function(err, freelancer) {
          if (err) {
            res.status(500).json({ error : 'database error while finding freelancer' });  // TESTED
          } else if (!freelancer) {
            res.status(404).json({ error : 'freelancer not found' }); // TESTED
          } else if (freelancer.state !== 'not verified') {
            res.status(453).json({ error : 'freelancer id already verified' }); // TESTED
          } else {
            user.freelancer = req.body.freelancerId;
            user.claiming = true;
            user.save(function(err) {
              if (err) {
                res.status(500).json({ error : 'database error while saving user' });  // CANNOT TEST
              } else {
                freelancer.state = 'in progress';
                freelancer.save(function(err) {
                  if (err) {
                    res.status(500).json({ error : 'database error while saving freelancer' });  // CANNOT TEST
                  } else {
                    let newClaim = new Claim({
                      userID : req.session.user_id,
                      freelanceID : req.body.freelancerId,
                    });
                    newClaim.save(function(err, claim) {
                      if (err) {
                        res.sendStatus(500).json({ error : 'database error while saving claim' });  // CANNOT TEST
                      } else {
                        res.status(201).json(claim); // TESTED
                      }
                    });
                  }
                })
              }
            });
          }
        });
      }
    });
  }
});


module.exports = router;
