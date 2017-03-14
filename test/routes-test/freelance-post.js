'use strict';

var should = require('should');
var config = require('../config');
var app = require(config.projectRoot + '/app');
var request = require('supertest');

describe('Freelance-post test: ', function() {
  // TEST: correct post.
  it('app should get answer 200 on POST /freelance', function(done) {
    request(app)
    .post('/freelance')
    .send({"name" : "Patrick Balestra", "email" : "user@email.com"})
    .expect(200)
    .end(function(err, res) {
      if (err) {
        done(err);
      } else {
        res.body.should.have.property("name", "Patrick Balestra");
        res.body.should.have.property("email", "user@email.com");
        done();
      }
    });
  });

  // TEST: not correct post: path "name" is required.
  it('app should get answer 400 on POST /freelance', function(done) {
    request(app)
    .post('/freelance')
    .send({"email" : "user@email.com"})
    .expect(400)
    .end(function(err, res) {
      if (err) {
        done(err);
      } else {
        res.should.have.property("text", "{\"reason\":\"Freelance validation failed\",\"errors\":[\"Path `name` is required.\"]}")
        done();
      }
    });
  });

  // TEST: not correct post: path "email" is required.
  it('app should get answer 400 on POST /freelance', function(done) {
    request(app)
    .post('/freelance')
    .send({"name" : "Patrick Balestra"})
    .expect(400)
    .end(function(err, res) {
      if (err) {
        done(err);
      } else {
        res.should.have.property("text", "{\"reason\":\"Freelance validation failed\",\"errors\":[\"Path `email` is required.\"]}")
        done();
      }
    });
  });
});
