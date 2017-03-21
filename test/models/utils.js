/* Utilities for the models tests */

'use strict';

var config = require('../config')
var should = require('should');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

module.exports.checkDateCreatedWithin = function checkDateCreatedWithin(obj, prop, max, done) {

  obj.save(function(err, saved){
      should.not.exist(err, 'No error should occur');
      var diff = Date.now() - saved[prop].getTime();
      diff.should.be.below(max);
      done();
  });
}
