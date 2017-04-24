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

describe('User-put test: ', function() {

  describe('PUT /user/:username', function() {
    before(seed);
    after(utils.dropDbAndCloseConnection);

    // CORRECT: change email
    it('should respond with 204 after a successful update of email', function(done) {
      request(app)
      .put('/user/' + seedData[4].data[0].username.toString())
      .set('Accept', 'application/json')
      .send({
        "email" : "wubba-lubba-dub-dub@universe.me",
      })
      .expect(204)
      .end(function() {
        request(app)
        .get('/user/' + seedData[4].data[0].username.toString())
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(200)
        .end(function(err, res) {
          var user = JSON.parse(res.text) || {};
          user.email.should.be.equal("wubba-lubba-dub-dub@universe.me");
          done();
        });
      });
    });

    // CORRECT: change username
    it('should respond with 204 after a successful update of username', function(done) {
      request(app)
      .put('/user/' + seedData[4].data[0].username.toString())
      .set('Accept', 'application/json')
      .send({
        "username" : "rick_sanchez",
      })
      .expect(204)
      .end(function() {
        request(app)
        .get('/user/rick_sanchez')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(200)
        .end(function(err, res) {
          var user = JSON.parse(res.text) || {};
          user.username.should.be.equal("rick_sanchez");
          user.email.should.be.equal("wubba-lubba-dub-dub@universe.me");
          done();
        });
      });
    });

    // ERROR: change username, already existing
    it('should respond with 409 after a failed update of username (already existing)', function(done) {
      request(app)
      .put('/user/rick_sanchez')
      .set('Accept', 'application/json')
      .send({
        "username" : "Smaug",
      })
      .expect(409)
      .end(function(err, res) {
        if (err) done(err);
        else {
          res.body.should.have.property("errors", ["Username `Smaug` is already in use."]);
          done();
        }
      });
    });

    // ERROR: cannot update freelancer field using this route
    it('should respond with 400 after an attempt to update the freelancer field', function(done) {
      request(app)
      .put('/user/' + seedData[4].data[0].username.toString())
      .set('Accept', 'application/json')
      .send({
        "freelancer" : "58cc4941fc13ae612c00000a",
      })
      .expect(400)
      .end(function(err, res) {
        if (err) done(err);
        else {
          res.body.should.have.property("errors", ["Cannot set `freelancer` field of user `MrSatan` using `PUT /user/:username`."]);
          done();
        }
      });
    });

    // ERROR: non-existing username
    it('should respond with a 404 if the user does not exist', function(done) {
      request(app)
        .put('/user/a_username_that_is_very_unlikely_to_exist')
        .set('Accept', 'application/json')
        .send({
          "email" : "mehemail",
        })
        .expect(404, done);
    });

    // ERROR: unsupported method
    it('should respond with a 405 if the method is not GET, PUT or OPTIONS', function(done) {
      request(app)
        .head('/user/' + seedData[4].data[0].username.toString())
        .set('Accept', 'application/json')
        .expect(405, done);
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
