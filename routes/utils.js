'use strict';

const config = require('../config');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Tag = mongoose.model('Tag');
const User = mongoose.model('User');
const Freelance = mongoose.model('Freelance');


module.exports = {

  // Create JSON error message in case mongoose fails.
  formatErrorMessage : function(err) {
    let reason = err.message;
    let errorKeys = Object.keys(err.errors);
    let errorJSON = { "reason" : reason };
    let errors = [];
    for (let error of errorKeys) {
      errors.push(err.errors[error].message);
    }
    errorJSON.errors = errors;
    return errorJSON;
  },

  // Add self link to returned object
  addLinks : function(object, type) {
    object.links = [{
      "rel" : "self",
      "href" : config.url + "/" + type + "/" + object._id
    }];
  },

  searchInTags : function(regex, done) {
    var freelancer_ids = [];
    Tag.find({ tagName : regex }).exec(function(err, results) {
      if (results) {
        results.forEach(function(tag) {
          tag.freelancers.forEach(function(id) {
            freelancer_ids.push(id);
          });
        });
      }
      done(freelancer_ids);
    });
  },

  // returns true if the given username is  not already taken
  checkUsername : function(user, done) {
    User.find({ username : user.username }).exec(function(err, results) {
      if (Object.keys(results).length == 0) {
        return done(true);
      }
      else {
        return done(false);
      }
    });
  },

  // Asynchronous call for checking the tags
  checkIfTagExists : function(givenTag) {
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
  },

}
