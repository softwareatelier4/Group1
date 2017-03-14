'use strict';

var should = require('should');
var config = require('../config');
var app = require(config.projectRoot + '/app');
var request = require('supertest');

describe('Freelance-get test: ', function() {
  // should.exist(1);
  it('app should get answer 200 on GET /', function(done){
  	request(app)
  	  .get('/')
  	  .expect(200)
  	  .end(function(err,res) {
  	    if (err) done(err);
  	    else done();
  	  });
  });
});
