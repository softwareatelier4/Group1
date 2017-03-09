'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('Placeholder test: ', function() {
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
