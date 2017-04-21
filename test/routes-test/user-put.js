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
    after(utils.dropDb);

    it('should respond with 204 after a successful update of the freelancer field', function(done) {
      request(app)
        .put('/user/' + seedData[4].data[0].username.toString())
        .set('Accept', 'application/json')
        .send({
          "freelancer" : "58cc4941fc13ae612c00000a",
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
              user.freelancer.should.be.equal("58cc4941fc13ae612c00000a");
              request(app)
                .get('/freelance/58cc4941fc13ae612c00000a')
                .set('Accept', 'application/json')
                .set('Ajax', 'true')
                .expect('Content-Type', /json/, 'it should respond with json')
                .expect(200)
                .end(function(err, res) {
                  var freelancer = JSON.parse(res.text) || {};
                  freelancer.state.should.be.equal("verified");
                  done();
                });
            });
        });
    });

    it('should respond with 204 after a successful update another field', function(done) {
      request(app)
        .put('/user/' + seedData[4].data[0].username.toString())
        .set('Accept', 'application/json')
        .send({
          "email" : "kek420@dankme.me",
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
              user.email.should.be.equal("kek420@dankme.me");
              done();
            });
        });
    });

    it('should respond with 400 if the given freelancer is already verified', function(done) {
      request(app)
        .put('/user/' + seedData[4].data[1].username.toString())
        .set('Accept', 'application/json')
        .send({
          "freelancer" : "58cc4941fc13ae612c00000a",
        })
        .expect(400, done);
    });

    it('should respond with a 404 if the user does not exist', function(done) {
      request(app)
        .put('/user/a_username_that_is_very_unlikely_to_exist')
        .set('Accept', 'application/json')
        .send({
          "email" : "mehemail",
        })
        .expect(404, done);
    });

    it('should respond with a 400 if the freelance does not exist', function(done) {
      request(app)
        .put('/user/' + seedData[4].data[0].username.toString())
        .set('Accept', 'application/json')
        .send({
          "freelancer" : new ObjectId().toString(),
        })
        .expect(400, done);
    });

    it('should respond with a 400 if the given freelance ID is not valid', function(done) {
      request(app)
        .put('/user/' + seedData[4].data[0].username.toString())
        .set('Accept', 'application/json')
        .send({
          "freelancer" : "7",
        })
        .expect(400, done);
    });

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
