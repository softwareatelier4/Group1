'use strict';

var mongoose   = require('mongoose');
var ObjectId   = mongoose.Types.ObjectId;

var should = require('should');
var config = require('../config');
var app = require(config.projectRoot + '/app');
var seedData = require('../../seed_data/seedData');
var seedDb = require('../../seed_data/seedDb');
var utils = require('../../seed_data/utils');
var test_utils = require('./utils');
var request = require('supertest');

describe('User-post test: ', function() {

  describe('POST /user', function() {

    before(seed);
    after(utils.dropDb);

    // TEST: correct post
    it('app should get answer 201 on POST /user with new username and no freelancer', function(done) {
      request(app)
      .post('/user')
      .send({
        "username" : "Susanna",
        "password" : "ISecretlyLoveCats",
        "email" : "user@email.com",
      })
      .expect(201)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          res.body.should.have.property("username", "Susanna");
          res.body.should.not.have.property("password");
          res.body.should.have.property("email", "user@email.com");
          done();
        }
      });
    });

    // TEST: correct post, but username is already taken
    it('app should get answer 409 on POST /user if the username is already taken', function(done) {
      request(app)
      .post('/user')
      .send({
        "username" : "Susanna",
        "password" : "ISecretlyLoveCats",
        "email" : "user@email.com",
      })
      .expect(409)
      .end(function(err, res) {
        if (err) done(err);
        else {
          res.body.should.have.property("errors", ["Username `Susanna` is already in use."]);
          done();
        }
      });
    });

    // TEST: not correct post: missing required properties.
    it('app should get answer 400 on POST /user', function(done) {
      request(app)
      .post('/user')
      .send({"username" : "Patrick"})
      .expect(400)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          res.body.should.have.property("errors", ["Path `email` is required.", "Path `password` is required."]);
          done();
        }
      });
    });

    // TEST: not correct post: missing required properties.
    it('app should get answer 400 on POST /user', function(done) {
      request(app)
      .post('/user')
      .send({"password" : "pah"})
      .expect(400)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          res.body.should.have.property("errors", ["Path `email` is required.", "Path `username` is required."]);
          done();
        }
      });
    });

    // TEST: not correct post: missing required properties.
    it('app should get answer 400 on POST /user', function(done) {
      request(app)
      .post('/user')
      .send({"email" : "user@email.com"})
      .expect(400)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          res.body.should.have.property("errors", ["Path `password` is required.", "Path `username` is required."]);
          done();
        }
      });
    });

    // TEST: not correct post: missing required properties.
    it('app should get answer 400 on POST /user', function(done) {
      request(app)
      .post('/user')
      .send({
        "username" : "Valerie",
        "password" : "ILoveCats",
      })
      .expect(400)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          res.body.should.have.property("errors", ["Path `email` is required."]);
          done();
        }
      });
    });

    // TEST: not correct post: missing required properties.
    it('app should get answer 400 on POST /user', function(done) {
      request(app)
      .post('/user')
      .send({
        "username" : "Lara",
        "email" : "hypocryptic@email.com",
      })
      .expect(400)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          res.body.should.have.property("errors", ["Path `password` is required."]);
          done();
        }
      });
    });

    // TEST: not correct post: missing required properties.
    it('app should get answer 400 on POST /user', function(done) {
      request(app)
      .post('/user')
      .send({
        "password" : "0123456789", // very strong password
        "email" : "volpic@email.com",
      })
      .expect(400)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          res.body.should.have.property("errors", ["Path `username` is required."]);
          done();
        }
      });
    });
  });
});


function seed(done) {
  //seed the db
  seedDb.seed(function(err, seedData) {
    if (err) return done(err);
    done();
  });
}
