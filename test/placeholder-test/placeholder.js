'use strict';

var should = require('should');
var config = require('./../config');
var request = require('supertest');

describe('Placeholder test: ', function(done) {
  // should.exist(1);
  it('should get answer 200 on GET /', function(done){
  	request(config.baseURL)
  	  .get('/')
  	  .expect(200)
  	  .end(function(err,res) {
  	    if (err) return done(err);

  	    done();
  	  });
  });
});
