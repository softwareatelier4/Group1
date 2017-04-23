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
  if (adminUsername !== req.query.username || adminPassword !== req.query.password) {
    res.status(401).json({ error : 'wrong username or password' }); // TESTED
  } else {
    Category.find().lean().exec(function(err, categories) {
      if (err) {
        res.status(500).json({ error : 'database error while finding categories' }); // CANNOT TEST
      } else if (!categories) {
        res.status(404).json({ error : 'categories not found' }); // TODO: TEST
      } else {
        Claim.find().populate('freelanceID userID').lean().exec(function(err, claims) {
          if (err) {
            res.status(500).json({ error : 'database error while finding claims' }); // CANNOT TEST
          } else if (!claims) {
            res.status(404).json({ error : 'claims not found' }); // TODO: TEST
          } else {
            res.status(200).json({ // TESTED
              valid : true,
              categories : categories,
              claims : claims
            });
          }
        });
      }
    });
  }
});

router.get('/files/:claimid', function(req, res) {
  if (adminUsername !== req.query.username || adminPassword !== req.query.password) {
    res.status(401).json({ error : 'wrong username or password' }); // TESTED
  } else {
    let filesDir = path.resolve(__dirname, '../../public/claims/', req.params.claimid);
    let filesZip = filesDir + '-' + req.query.user + '-' + req.query.freelancer + '.zip';
    if (!fs.existsSync(filesDir)) {
      res.status(404).json({ error : 'no file directory for this claim id' }); // TESTED
    } else {
      let files = fs.readdirSync(filesDir);
      if (files.length == 0) {
        res.status(404).json({ error : 'file directory is empty' }); // TODO: TEST
      } else {
        zipper(filesDir, filesZip, function(err) {
          if (err) {
            res.status(500).json({ error : 'zipper error while zipping files' }); // CANNOT TEST
          } else {
            res.download(filesZip, function(err) {
              if (err) {
                res.status(500).json({ error : 'download error while sending files' }); // CANNOT TEST
              } else {
                fs.unlinkSync(filesZip); // TODO: TEST
              }
            });
          }
        });
      }
    }
  }
});

// Return index
router.get('/', function(req, res, next) {
  if (req.accepts('text/html')) {
    res.render('admin', { // TESTED
      title: "JobAdvisor",
    });
  }
  else {
    res.sendStatus(400); // TESTED
  }
});

router.post('/category', function(req, res) {
  if (adminUsername === req.query.username && adminPassword === req.query.password) {
    if (!req.body.categoryName) {
      res.status(400).json({ error : 'no category name given' }); // TESTED
    } else {
      const newCategory = new Category(req.body);
      newCategory.save(function(err, saved) {
        if (err) {
          res.status(500).json({ error : 'database error while saving category' }); // CANNOT TEST
        } else {
          res.status(201).json(saved); // TESTED
        }
      });
    }
  } else {
    res.status(401).json({ error : 'wrong username or password' }); // TESTED
  }
});

router.put('/category', function(req, res) {
  if (adminUsername === req.query.username && adminPassword === req.query.password) {
    if (!req.query.id) {
      res.status(400).json({ error : 'no category id given' }); // TESTED
    } else {
      Category.findByIdAndUpdate(req.query.id,
                                 { categoryName : req.body.categoryName },
                                 { new : true },
                                 function(err, category) {
        if (err) {
          res.status(500).json({ error : 'database error while finding and updating category' }); // TESTED
        } else if (!category) {
          res.status(404).json({ error : 'category not found' }); // TESTED
        } else {
          res.status(201).json(category); // TESTED
        }
      });
    }
  } else {
    res.status(401).json({ error : 'wrong username or password' }); // TESTED
  }
});

router.delete('/category', function(req, res) {
  if (adminUsername !== req.query.username || adminPassword !== req.query.password) {
    res.status(401).json({ error : 'wrong username or password' }); // TESTED
  } else {
    if (!req.query.id) {
      res.status(400).json({ error : 'no category id given' }); // TESTED
    } else {
      Category.findById(req.query.id, function(err, category) {
        if (err) {
          res.status(500).json({ error : 'database error while finding category' }); // TESTED
        } else if (!category) {
          res.status(404).json({ error : 'category not found' }); // TESTED
        } else {
          Freelance.updateMany({ _id : { $in : category.freelancers } }, { category : undefined }, function(err, freelancers) {
            if (err) {
              res.status(500).json({ error : 'database error while updating freelances' }); // CANNOT TEST
            } else {
              category.remove(function(err) {
                if (err) {
                  res.status(500).json({ error : 'database error while removing category' }); // CANNOT TEST
                } else {
                  res.sendStatus(204); // TESTED
                }
              });
            }
          });
        }
      });
    }
  }
});

router.delete('/claim', function(req, res) {
  if (adminUsername !== req.query.username || adminPassword !== req.query.password) {
    res.status(401).json({ error : 'wrong username or password' }); // TESTED
  } else {
    Claim.findById(req.query.claimid, function(err, claim) {
      if (err) {
        res.status(500).json({ error : 'database error while finding claim' }); // TESTED
      } else if (!claim) {
        res.status(404).json({ error : 'claim not found' }); // TESTED
      } else {
        Freelance.findById(claim.freelanceID, function(err, freelancer) {
          if (err) {
            res.status(500).json({ error : 'database error while finding freelancer' }); // CANNOT TEST
          } else if (!freelancer) {
            res.status(404).json({ error : 'freelancer not found' }); // TESTED
          } else if (freelancer.state !== 'in progress') {
            res.status(400).json({ error : 'freelancer is not claimed' }); // TESTED
          } else {
            User.findById(claim.userID, function(err, user) {
              if (err) {
                res.status(500).json({ error : 'database error while finding user' }); // CANNOT TEST
              } else if (!user) {
                res.status(404).json({ error : 'user not found' }); // TESTED
              } else if (!user.freelancer) {
                res.status(400).json({ error : 'user is not claiming' }); // TESTED
              } else if (user.freelancer && !user.claiming) {
                res.status(400).json({ error : 'user is already associtated with a freelancer' }); // TESTED
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
                  res.status(400).json({ error : 'invalid choice' }); // TESTED
                }
                if (req.query.choice === 'accept' || req.query.choice === 'reject') {
                  freelancer.save(function(err) {
                    if (err) {
                      res.status(500).json({ error : 'database error while saving freelancer' }); // CANNOT TEST
                    } else {
                      user.save(function(err) {
                        if (err) {
                          res.status(500).json({ error : 'database error while saving user' }); // CANNOT TEST
                        } else {
                          // Remove claim folder with submitted files
                          let claimDir = path.resolve(__dirname, '../../public/claims/', req.query.claimid);
                          rmDir(claimDir);
                          // Remove claim from db
                          claim.remove(function(err) {
                            if (err) {
                              res.status(500).json({ error : 'database error while removing claim' }); // CANNOT TEST
                            } else {
                              res.sendStatus(204); // TESTED
                              // Sending emails doesn't work on Jenkins
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
                              //       res.sendStatus(500).json({ error : 'nodemailer error while sending email' }); // CANNOT TEST
                              //   } else {
                              //       res.sendStatus(204); // TESTED
                              //   };
                              // });
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
