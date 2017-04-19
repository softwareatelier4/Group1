'use strict';

const config = require('../config');
const mongoose = require('mongoose');
const Tag = mongoose.model('Tag');
const User = mongoose.model('User');


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

}
