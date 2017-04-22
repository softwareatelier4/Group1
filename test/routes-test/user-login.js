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

var Cookies;

describe('Login and logout test: ', function() {

  describe('POST /user/login and GET /user/logout', function() {

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
      .expect(202).end(function(err,res) {
        var re = new RegExp('; path=/; httponly', 'gi');
        Cookies = res.headers['set-cookie'].map(function(r) {
            return r.replace(re, '');
          }).join("; ");
        done();
      });
    });

    // WRONG: duplicate login without ending session first
    it('app should get answer 409 on POST /user/login if already logged in', function(done) {
      let req = request(app).post('/user/login');
      req.cookies = Cookies;
      req.send({
        "username" : "MrSatan",
        "password" : "666",
      })
      .expect(409).end(done);
    });

    // CORRECT: logout after login
    it('app should get answer 202 on GET /user/logout if already logged in', function(done) {
      let req = request(app).get('/user/logout');
      req.cookies = Cookies;
      req.expect(202).end(done);
    });

    // CORRECT: login after logout
    it('app should get answer 202 on POST /user/login with correct username and password', function(done) {
      request(app)
      .post('/user/login')
      .send({
        "username" : "MrSatan",
        "password" : "666",
      })
      .expect(202).end(done);
    });

    // ERROR: login with wrong password
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
