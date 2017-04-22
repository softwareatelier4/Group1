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

describe('User-get test: ', function() {
  describe('GET /user', function() {
    before(seed);
    after(utils.dropDb);

    it('should be unauthorised if no user logged in', function(done) {
      request(app)
        .get('/user')
        .set('Accept', 'application/json')
        .expect(401)
        .end(done);
    });
  });

  describe('GET /user/:username', function() {
    before(seed);
    after(utils.dropDb);

    it('should list the user with correct data and without the password', function(done) {
      request(app)
        .get('/user/' + seedData[4].data[0].username.toString())
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(200)
        .end(function(err, res) {
          var user = JSON.parse(res.text) || {};
          test_utils.checkUserInfoInResponse(user, seedData[4].data[0]);
          done();
        });
    });

    it('should respond with a 404 if the user does not exist', function(done) {
      request(app)
        .get('/user/a_username_that_is_very_unlikely_to_exist')
        .set('Accept', 'application/json')
        .expect(404, done);
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
