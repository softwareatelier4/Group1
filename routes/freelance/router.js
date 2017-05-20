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
const Tag = mongoose.model('Tag');

// Supported methods.
router.all('/', middleware.supportedMethods('GET, POST, PUT, OPTIONS'));
router.all('/new', middleware.supportedMethods('GET, OPTIONS'));
router.all('/:freelanceid', middleware.supportedMethods('GET, PUT, OPTIONS, DELETE')); //add delete later
router.all('/:freelanceid/availability', middleware.supportedMethods('PUT, OPTIONS')); //add delete later

// GET /freelance/new
router.get('/new', function(req, res, next) {
  if (req.accepts('text/html')) {
    if(req.session.user_id) {
       User.findById(req.session.user_id).exec(function(err, user){
        res.render('freelancer-create', {
          title: "JobAdvisor - Create Freelancer Profile" ,
          logged: true,
          username: user.username,
          userFreelancer: user.freelancer[0]
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
         let freelancerIndex;
         if (err) {
           res.status(500).json({ error : 'error finding user in database' });
         } else if (!user) {
           res.status(404).json({ error : 'user not found' });
         } else if ((freelancerIndex = user.freelancer.indexOf(req.query.freelancer)) < 0) { // freelancer not claimed by user
           res.redirect('/');
         } else {
           Freelance.findById(user.freelancer[freelancerIndex]).exec(function(err, freelancer){
             if(err || !freelancer) {
               res.sendStatus(501);
             } else {
               res.render('freelancer-edit', {
                 title: "JobAdvisor - Edit Freelancer Profile" ,
                 logged: true,
                 username: user.username,
                 userFreelancer: freelancer._id,
                 userFreelancerInfo: freelancer.firstName + ' ' + freelancer.familyName + ' (' + freelancer.title + ')',
               });
             }
           });
         }
      });
    } else {
      res.render('freelancer-edit', {
        title: "JobAdvisor - Edit Freelancer Profile" ,
        logged: false
      });
      // res.render('freelancer-edit', {
      //   title: "JobAdvisor - Edit Freelancer Profile" ,
      //   logged: true,
      //   username: "MrSatan",
      //   userFreelancer: "58cc4942fc13ae612c000023"
      // });

    }

  } else res.sendStatus(400);
});

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
      }).populate('tags category owner').exec(function(err, freelance) {
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
            userFreelancer: user.freelancer[0],
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

// PUT freelance/:freelanceid/availability/
router.put('/:freelanceid/availability', function(req, res, next) {
  let req_array = req.body;
  let days_array = [];

  // check if the request is valid
  if (!req_array.every(function(day) {
    return (
      day.day
      && day.begin
      && day.end
      && day.location
      // Checked using conversion to Date, but saved as a string
      && (new Date (day.day) instanceof Date)
      && (!isNaN((new Date (day.day)).valueOf()))
      && (new Date (day.begin) instanceof Date)
      && (!isNaN((new Date (day.begin)).valueOf()))
      && (new Date (day.end) instanceof Date)
      && (!isNaN((new Date (day.end)).valueOf()))
      && (typeof day.location === 'string')
      && (days_array.push(day))
    );
  })) {
    res.status(400).end();
  } else {
    Freelance.findById(req.params.freelanceid).exec(function(err, freelance) {
      if (err) res.status(500).json(utils.formatErrorMessage(err));
      else if (!freelance) {
        res.status(404).json({
          message: "Freelance not found with the given id."
        });
      } else {
        freelance.availability = days_array;
        freelance.save(function (err, updated) {
          if (err) {
            res.status(500).json(utils.formatErrorMessage(err));
          }
          else {
            res.status(204).end();
          }
        });
      }
    });
  }
});

// PUT freelance/:freelanceid/edit/
router.put('/:freelanceid/edit', function(req, res, next) {
  // TODO must Add freelance in the tags reference.
  // checks if user is correct
  if(req.session.user_id) {
       User.findById(req.session.user_id).exec(function(err, user){
        let freelancerIndex;
         if (err) {
           res.status(500).json({ error : 'error finding user in database' }); // TODO: TEST (wrong id)
         } else if (!user) {
           res.status(404).json({ error : 'user not found' }); // TODO: TEST (id not existing)
         } else if (!user.freelancer || (freelancerIndex = user.freelancer.indexOf(req.params.freelanceid)) < 0) {
           res.status(403).json({ error : 'user not allowed to edit' }); // TODO: TEST (user not owner)
         } else {
           let data = req.body
           // need to make 2 calls instead of 'findAndUpdate' to run the validators in mongo
            Freelance.findById(req.params.freelanceid).exec(function(err, freelance){
              if(err){
                res.status(500).json({ error : 'error editing freelance data' }); // TODO: TEST (wrong id)
              } else if (!freelance){
                res.status(404).json({ error : 'freelance not found for editing' }); // TODO: TEST (id not existing)
              } else {
                freelance.phone = data.phone || freelance.phone;
                freelance.email = data.email || freelance.email;
                freelance.description = data.description || freelance.description;
                freelance.address = data.address || freelance.address;
                freelance.price = data.price || freelance.price;
                
                // Asynchronous call for sending the response
                function sendResponse() {
                  freelance.save(function(err, updatedfreelance){
                    if(err){
                      res.status(500).json({ error : 'error updating freelance' }); // NOT TESTABLE
                    } else if (!updatedfreelance){
                      res.status(404).json({ error : 'freelance not found' }); // NOT TESTABLE
                    } else {
                      res.status(201).json(updatedfreelance); // TODO: TEST (correct execution)
                    }
                  });
                }
                // here I suppose that data contains all the tags (old and new )
                // i.e. the size of 'tags' should be the total number of tags after update
                if(data.tags) {
                  // There are tags in the put:
                  var tags = data.tags.split(',');

                  var counter = 0;
                  for (let tag of tags) {
                    // Asynchronous call to set the tags.
                    checkIfTagExists(tag);
                  }

                  // Asynchronous call for checking the tags
                  function checkIfTagExists(givenTag) {
                    Tag.findOne({'tagName' : givenTag}).exec(function(err, foundTag) {
                      if (err || (foundTag == undefined)) {
                        // Tag is not in the database, add it
                        const newTag = new Tag({
                          tagName: givenTag,
                        });
                        newTag.freelancers.push(req.params.freelanceid);
                        // Save tag and proceed to process response.
                        newTag.save(function(errTag, savedTag) {
                          if (err) {
                            console.log("Error with saving the tag: " + err);
                            res.status(400).json(utils.formatErrorMessage(errTag));
                          }
                          freelance.tags.push(savedTag);
                          counter++;
                          if (tags.length == counter) {
                            sendResponse();
                          }
                        });
                      } else {
                        if (foundTag.freelancers.indexOf(req.params.freelanceid) < 0) {
                          // Add this new freelance to the freelancers that have this tag.
                          foundTag.freelancers.push(req.params.freelanceid);
                        }
                        foundTag.save(function(errTag, savedTag) {
                          if (err) {
                            console.log("Error with saving the tag: " + err);
                            res.status(400).json(utils.formatErrorMessage(errTag));
                          }
                          // Save tag into freelance list of tags
                          freelance.tags.push(savedTag);
                          counter++;
                          if (tags.length == counter) {
                            sendResponse();
                          }
                        });
                      }
                    });
                  }
                // END IF data.tags
                } else {
                  sendResponse();
                }
              }
            });
         }
      });
    }
});


// POST freelance/
router.post('/', function(req, res, next) {
  // There are tags in the post:
  if (req.body.tags) {
    var tags = req.body.tags.split(',');
  }

  let parameters = req.body;
  delete parameters.tags;
  const newFreelance = new Freelance(parameters);

  // Save Freelance to get its id.
  newFreelance.save(function(err, saved) {
    if (err) {
      res.status(400).json(utils.formatErrorMessage(err));
      return;
    }

    // Now we can parse, create and save the tags.
    let count = 0;
    if (tags != undefined) {
      // For every tag, check if it's already in the database or not
      for (let tag of tags) {
        tag = tag.trim();
        // Asynchronous call for checking for the tag
        checkIfTagExists(tag);
      }
    } else {
      // If no tag are present, send response immediately.
      sendResponse();
    }

    // Asynchronous call for sending the response
    function sendResponse() {
      saved.save(function(err, saved2) {
        res.status(201).json(saved2);
      });
    }

    // Asynchronous call for checking the tags
    function checkIfTagExists(givenTag) {
      Tag.findOne({'tagName' : givenTag}).exec(function(err, foundTag) {
        if (err || (foundTag == undefined)) {
          // Tag is not in the database, add it
          const newTag = new Tag({
            tagName: givenTag,
          });
          newTag.freelancers.push(saved);
          // Save tag and proceed to process response.
          newTag.save(function(errTag, savedTag) {
            if (err) {
              console.log("Error with saving the tag: " + err);
              res.status(400).json(utils.formatErrorMessage(errTag));
            }
            saved.tags.push(savedTag);
            count++;
            if (tags.length == count) {
              sendResponse();
            }
          });
        } else {
          // Add this new freelance to the freelancers that have this tag.
          foundTag.freelancers.push(saved);
          foundTag.save(function(errTag, savedTag) {
            if (err) {
              console.log("Error with saving the tag: " + err);
              res.status(400).json(utils.formatErrorMessage(errTag));
            }
            // Save tag into freelance list of tags
            saved.tags.push(savedTag);
            count++;
            if (tags.length == count) {
              sendResponse();
            }
          });
        }
      });
    }

  });
});

// Delete freelance and all its references in user and tag
router.delete('/:freelanceid', function(req, res, next) {
  Freelance.findById(req.params.freelanceid).exec(function(err, freelance) {
    let freelanceID = req.params.freelanceid;
    let userID = freelance.owner;
    let tagsArray = freelance.tags;

    if (err) {
      res.status(400).json({error: "Error while finding freelancer"});
    } else if (!freelance) {
      res.status(400).json({error: "No freelancer found"});
    } else {
      freelance.remove(function(errFreelance, removedFreelance) {
        // Remove freelance from database
        if (err) {
          res.status(400).json({error: "Error while removing freelancer"});
        } else {
          if (tagsArray != undefined) {
            var count = 0;
            for (let tag of tagsArray) {
              deleteReferenceFromTag(tag);
            } 
          } else {
            deleteReferenceFromUser();
          }
        }

        function deleteReferenceFromTag(tag) {
          Tag.findById(tag).exec(function(errTag, foundTag) {
            if (err || !foundTag) {
              res.status(400).json({error: "error when finding tag"});
            } else {
              let freelancersTag = foundTag.freelancers;
              let indexOfTag = freelancersTag.indexOf(freelanceID);
              freelancersTag.splice(indexOfTag, 1);

              foundTag.save(function(errSavedTag, savedTag) {
                if (err || !savedTag) {
                  res.status(400).json({error: "error while saving tag"});
                } else {
                  count++;
                  if (tagsArray.length == count) {
                    deleteReferenceFromUser();
                  }
                }
              });
            }
          });
        }

        function deleteReferenceFromUser() {
          User.findById(userID).exec(function(errUser, foundUser) {
            if (err) {
              res.status(400).json({error: "error while finding user"});
            } else if (!foundUser) {
              res.status(201).json(removedFreelance);
            } else {
              // User has been found, remove reference of freelance from user
              let arrayFreelanceUser = foundUser.freelancer;
              let indexOfFreelance = arrayFreelanceUser.indexOf(freelanceID);
              arrayFreelanceUser.splice(indexOfFreelance, 1);
              foundUser.freelancer = arrayFreelanceUser;
              
              foundUser.save(function(errUser, savedUser) {
                if (err || !savedUser) {
                  res.status(400).json({error: "error while saving user"});
                } else {
                  // User has been updated
                  res.status(201).json(removedFreelance);
                }
              });
            }
          });
        }
      });
    }
  });
});

module.exports = router;
