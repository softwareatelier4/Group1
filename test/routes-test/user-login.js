'use strict';

var mongoose   = require('mongoose');
var ObjectId   = mongoose.Types.ObjectId;

var should = require('should');
var config = require('../config');
var app = require(config.projectRoot + '/app');
var seedData = require('../../seed_data/seedData');
var seedDb = require('../../seed_data/seedDb');
var seed_utils = require('../../seed_data/utils');
var utils = require('./utils');
var request = require('supertest');

describe('Login-post test: ', function() {

  describe('POST /user/login', function() {

    before(seed);
    after(seed_utils.dropDbAndCloseConnection);

    // CORRECT: login with correct password
    it('app should get answer 202 on POST /user/login with correct username and password', function(done) {
      request(app)
      .post('/user/login')
      .send({
        "username" : "MrSatan",
        "password" : "666",
      })
      .expect(202).end(done);
    });

    // CORRECT: login with wrong password
    it('app should get answer 401 on POST /user/login with correct username wrong password', function(done) {
      request(app)
      .post('/user/login')
      .send({
        "username" : "MrSatan",
        "password" : "a_wrong_password",
      })
      .expect(401).end(done);
    });

    // ERROR: login with non-existing username
    it('app should get answer 404 on POST /user/login with non-existing username', function(done) {
      request(app)
      .post('/user/login')
      .send({
        "username" : "a_username_that_unfortunately_does_not_exist",
        "password" : "any_password_really,_it_does_not_matter,_does_it?",
      })
      .expect(404).end(done);
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
