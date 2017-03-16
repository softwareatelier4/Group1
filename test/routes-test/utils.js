/** @module test/freelance/utils
* Utilities for the routes tests
*/

'use strict';

const mongoose = require('mongoose');
const assert = require('assert');
const ObjectId = mongoose.Types.ObjectId;

module.exports.checkFreelanceInfoInResponse = function checkFreelanceInfoInResponse(responseObj, freelance){
  var populated = ["reviews", "tags", "category"];
  Object.keys(freelance).forEach(function(key) {
    if (populated.indexOf(key) == -1) {
      responseObj.should.have.property(key, freelance[key]);
    } else {
      switch (key) {
        case "review": // Test for reviews in a freelance
        responseObj.reviews.forEach(function(review) {
          review.should.have.property("_id");
          review.should.have.property("author");
          review.should.have.property("date");
          review.should.have.property("text");
        }); break;

        case "tags":// Test for tags in a freelance
        responseObj.tags.forEach(function(tag) {
          tag.should.have.property("_id");
          tag.should.have.property("freelancers");
          tag.should.have.property("tagName");
        }); break;

        case "tags":// Test for category in a freelance
        /* not there yet */ break;

        default: break;
      }

    }
  });
}

module.exports.checkCategoryInfoInResponse = function checkCategoryInfoInResponse(responseObj, category){
  Object.keys(category).forEach(function(key) {
    // check validity of Freelance linked
    if (key == 'freelancers') {
      responseObj.freelancers.forEach(function(freelanceid) {
        assert.equal(ObjectId.isValid(freelanceid), true);
      });
    }
    responseObj.should.have.property(key);
  });
}
