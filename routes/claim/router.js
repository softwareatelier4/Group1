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

router.post('/new', function(req, res) {
  if (req.session.user_id && req.body.freelancerId) {
    User.findById(req.session.user_id, function(err, user) {
      if (err) {
        res.status(400).json({ error : 'wrong user id' });
      } else if (user.freelancer) {
        res.status(402).json({ error : 'user id already claiming' });
      } else {
        Freelance.findById(req.body.freelancerId, function(err, freelancer) {
          if (err) {
            res.status(400).json({ error : 'wrong freelancer id' });
          } else if (freelancer.state !== 'not verified') {
            res.status(403).json({ error : 'freelancer id already verified' });
          } else {
            user.freelancer = req.body.freelancerId;
            user.claiming = true;
            user.save(function(err) {
              if (err) {
                res.status(400).json({ error : 'failed user save' });
              } else {
                freelancer.state = 'in progress';
                freelancer.save(function(err) {
                  if (err) {
                    res.status(400).json({ error : 'failed freelancer save' });
                  } else {
                    let newClaim = new Claim({
                      userID : req.session.user_id,
                      freelanceID : req.body.freelancerId,
                    });
                    newClaim.save(function(err, claim) {
                      if (err) {
                        res.sendStatus(400).json({ error : 'failed claim save' });
                      } else {
                        res.status(201).json(claim);
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
  } else {
    res.status(401).json({ error : 'no user id or freelancer id' });
  }
});


module.exports = router;
