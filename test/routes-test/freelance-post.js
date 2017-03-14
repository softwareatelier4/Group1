'use strict';

var should = require('should');
var config = require('../config');
var app = require(config.projectRoot + '/app');
var request = require('supertest');

describe('Freelance-post test: ', function() {
  // TEST: correct post.
  it('app should get answer 201 on POST /freelance', function(done) {
    request(app)
    .post('/freelance')
    .send({
      "firstName" : "Patrick",
      "familyName" : "Balestra",
      "email" : "user@email.com",
      "price" : {},
    })
    .expect(201)
    .end(function(err, res) {
      if (err) {
        done(err);
      } else {
        res.body.should.have.property("firstName", "Patrick");
        res.body.should.have.property("familyName", "Balestra");
        res.body.should.have.property("email", "user@email.com");
        res.body.should.have.property("price");
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
        res.body.should.have.property("reason", "Freelance validation failed");
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
        res.body.should.have.property("reason", "Freelance validation failed");
        done();
      }
    });
  });
});
