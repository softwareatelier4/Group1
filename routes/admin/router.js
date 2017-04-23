/** @module admin/router */
'use strict';

const express = require('express');
const router = express.Router();
const middleware =  require('../middleware');
const rootUrl = require("../../config").url;
const utils = require('../utils');
const path = require('path');
const fs = require('fs')
const zipper = require('zip-folder');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Category = mongoose.model('Category');
const Freelance = mongoose.model('Freelance');
const Claim = mongoose.model('Claim');
const User = mongoose.model('User');
// const nodemailer = require('nodemailer');

const adminUsername = 'admin';
const adminPassword = 'asd';

// Supported methods
router.all('/', middleware.supportedMethods('GET, POST, DELETE, OPTIONS'));
router.all('/login', middleware.supportedMethods('GET, OPTIONS'));
router.all('/files/:claimid', middleware.supportedMethods('GET, OPTIONS'));
router.all('/category', middleware.supportedMethods('POST, PUT, DELETE, OPTIONS'));
router.all('/claim', middleware.supportedMethods('DELETE, OPTIONS'));

router.get('/login', function(req, res) {
  if (adminUsername === req.query.username && adminPassword === req.query.password) {
    Category.find().lean().exec(function(err, categories) {
      if (err) {
        res.sendStatus(500);
      } else {
        Claim.find().populate('freelanceID userID').lean().exec(function(err, claims) {
          if (err) {
            res.sendStatus(500);
          } else {
            res.status(200).json({
              valid : true,
              categories : categories,
              claims : claims
            });
          }
        });
      }
    });
  } else {
    res.sendStatus(401);
  }
});

router.get('/files/:claimid', function(req, res) {
  if (adminUsername === req.query.username && adminPassword === req.query.password) {
    let filesDir = path.resolve(__dirname, '../../public/claims/', req.params.claimid);
    let filesZip = filesDir + '-' + req.query.user + '-' + req.query.freelancer + '.zip';
    if (!fs.existsSync(filesDir)) {
      res.status(400).json({ error : 'no file directory for this claim id' });
    } else {
      let files = fs.readdirSync(filesDir);
      if (files.length == 0) {
        res.status(400).json({ error : 'file directory is empty' }); // should never happen
      } else {
        zipper(filesDir, filesZip, function(err) {
          if (err) {
            res.status(500).json({ error : 'failed to zip files' });
          } else {
            res.download(filesZip, function(err) {
              if (err) {
                res.status(500).json({ error : 'failed send zipped files' });
              } else {
                fs.unlinkSync(filesZip);
              }
            });
          }
        });
      }
    }
  } else {
    res.status(401).json({ error : 'wrong username or password' });
  }
});

// Return index
router.get('/', function(req, res, next) {
  if (req.accepts('text/html')) {
    res.render('admin', {
      title: "JobAdvisor",
    });
  }
  else {
    res.sendStatus(400);
  }
});

router.post('/category', function(req, res) {
  if (adminUsername === req.query.username && adminPassword === req.query.password) {
    const newCategory = new Category(req.body);
    newCategory.save(function(err, saved) {
      if (err) {
        res.status(400).json(utils.formatErrorMessage(err));
      } else {
        res.status(201).json(saved);
      }
    });
  } else {
    res.sendStatus(401);
  }
});

router.put('/category', function(req, res) {
  if (adminUsername === req.query.username && adminPassword === req.query.password && req.query.id) {
    Category.findByIdAndUpdate(req.query.id,
                               { categoryName : req.body.categoryName },
                               { new : true },
                               function(err, category) {
      if (err) {
        res.status(400).json(utils.formatErrorMessage(err));
      } else {
        res.status(201).json(category);
      }
    });
  } else {
    res.sendStatus(401);
  }
});

router.delete('/category', function(req, res) {
  if (adminUsername === req.query.username && adminPassword === req.query.password && req.query.id) {
    Category.findById(req.query.id, function(err, category) {
      if (err) {
        res.status(400).json(utils.formatErrorMessage(err));
      } else {
        Freelance.updateMany({ _id : { $in : category.freelancers } }, { category : undefined }, function(err, freelancers) {
          if (err) {
            res.status(400).json(utils.formatErrorMessage(err));
          } else {
            category.remove(function(err) {
              if (err) {
                res.status(400).json(utils.formatErrorMessage(err));
              } else {
                res.sendStatus(204);
              }
            });
          }
        });
      }
    });
  } else {
    res.sendStatus(401);
  }
});

router.delete('/claim', function(req, res) {
  if (adminUsername === req.query.username && adminPassword === req.query.password) {
    Claim.findById(req.query.claimid, function(err, claim) {
      if (err) {
        res.status(400).json({ error : 'invalid claim id' });
      } else {
        Freelance.findById(claim.freelanceID, function(err, freelancer) {
          if (err) {
            res.status(400).json({ error : 'invalid freelancer id' }); // should never happen
          } else if (freelancer.state != 'in progress') {
            res.status(400).json({ error : 'freelancer is not claimed' });
          } else {
            User.findById(claim.userID, function(err, user) {
              if (err) {
                res.status(400).json({ error : 'invalid user id' }); // should never happen
              } else if (!user.freelancer) {
                res.status(400).json({ error : 'user is not claiming' });
              } else if (user.freelancer && !user.claiming) {
                res.status(400).json({ error : 'user is already associtated with a freelancer' });
              } else {
                // Update models according to accept/reject
                if (req.query.choice === 'accept') {
                  freelancer.state = 'verified';
                  freelancer.owner = claim.userID;
                  user.claiming = false;
                } else if (req.query.choice === 'reject') {
                  freelancer.state = 'not verified';
                  user.claiming = false;
                  user.freelancer = undefined;
                } else {
                  res.status(400).json({ error : 'invalid choice' });
                }
                if (req.query.choice === 'accept' || req.query.choice === 'reject') {
                  freelancer.save(function(err) {
                    if (err) {
                      res.status(500).json({ error : 'error while saving freelancer' });
                    } else {
                      user.save(function(err) {
                        if (err) {
                          res.status(500).json({ error : 'error while saving user' });
                        } else {
                          // Remove claim folder with submitted files
                          let claimDir = path.resolve(__dirname, '../../public/claims/', req.query.claimid);
                          rmDir(claimDir);
                          // Remove claim from db
                          claim.remove(function(err) {
                            if (err) {
                              res.status(500).json({ error : 'error while deleting claim' });
                            } else {
                              // Send email
                              // let transporter = nodemailer.createTransport({
                              //     service: 'Gmail',
                              //     auth: {
                              //         user: 'jobadvisor.group1@gmail.com',
                              //         pass: '-5#x3Y;R;u<fz6}l'
                              //     }
                              // });
                              // let mailOptions = {
                              //   from: 'jobadvisor.group1@gmail.com',
                              //   to: req.query.email,
                              //   subject: 'Claim request',
                              //   html: req.query.message
                              // };
                              // transporter.sendMail(mailOptions, function(err, info){
                              //   if(err){
                              //       res.sendStatus(500).json({ error : 'failed to send email' });;
                              //   } else {
                              //       res.sendStatus(204);
                              //   };
                              // });
                              res.sendStatus(204);
                            }
                          });
                        }
                      });
                    }
                  });
                }
              }
            });
          }
        });
      }
    });
  } else {
    res.status(401).json({ error : 'wrong username or password' });
  }
});

// rm -rf dirPath
function rmDir(dirPath) {
  try { var files = fs.readdirSync(dirPath); }
  catch(e) { return; }
  if (files.length > 0)
    for (var i = 0; i < files.length; i++) {
      var filePath = dirPath + '/' + files[i];
      if (fs.statSync(filePath).isFile())
        fs.unlinkSync(filePath);
      else
        rmDir(filePath);
    }
  fs.rmdirSync(dirPath);
};

/** router for root */
module.exports = router;
