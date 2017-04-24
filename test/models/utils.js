/* Utilities for the models tests */

'use strict';

var config = require('../config')
var should = require('should');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

/* 
* Checks if the time from the 'save' call and Now differs at maximum 'max' ms
*/
module.exports.checkDateCreatedWithin = function checkDateCreatedWithin(obj, prop, max, done) {

  obj.save(function(err, saved){
      should.not.exist(err, 'No error should occur');
      var diff = Date.now() - saved[prop].getTime();
      diff.should.be.below(max);
      done();
  });
}

/** 
* Goes through a Mongoose ValidationError error to check specific properties
*/
module.exports.checkValidationErrorEnum = function checkValidationErrorEnum(err, prop, value){
  should.exist(err, 'There should be an error');
  err.name.should.equal('ValidationError');
  var propError = err.errors[prop];
  should.exist(propError, 'err.errors.' + prop + ' should exist');
  propError.name.should.equal('ValidatorError');
  propError.message.should.equal('`' + value + '` is not a valid enum value for path `' + prop + '`.');
}
