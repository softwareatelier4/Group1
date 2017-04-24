'use strict';

var mongoose   = require('mongoose');
var ObjectId   = mongoose.Types.ObjectId;

var should = require('should');
var config = require('../config');
var app = require(config.projectRoot + '/app');
var seedData = require('../../seed_data/seedData');
var seedDb = require('../../seed_data/seedDb');
var utils = require('../../seed_data/utils');
var compareutils = require('./utils');
var request = require('supertest');

describe('Admin-get test: ', function() {

  describe('GET /admin/login', function() {
    before(seed);
    after(utils.dropDbAndCloseConnection);

    it('should list the categories with correct data', function(done) {
      request(app)
        .get('/admin/login?username=admin&password=asd')
        .set('Ajax', 'true')
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(200)
        .end(function(err, res) {
          var categories = JSON.parse(res.text) || [];
          for (let i = 0; i < categories.length; ++i) {
            compareutils.checkCategoryInfoInResponse(category, seedData[3].data[i]);
          }
          done();
        });
    });

    it('should respond with 401 if username is wrong', function(done) {
      request(app)
        .get('/admin/login?username=wrongusername&password=asd')
        .set('Ajax', 'true')
        .expect(401)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("error", "wrong username or password");
            done();
          }
        });
    });

    it('should respond with 401 if password is wrong', function(done) {
      request(app)
        .get('/admin/login?username=admin&password=wrongpassword')
        .set('Ajax', 'true')
        .expect(401)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("error", "wrong username or password");
            done();
          }
        });
    });

  });

  describe('GET /admin/files/:claimid', function() {
    before(seed);
    after(utils.dropDbAndCloseConnection);

    // WRONG
    it('should respond with 401 if username is wrong', function(done) {
      request(app)
        .get('/admin/files/CLAIMID?username=wrongusername&password=asd')
        .set('Ajax', 'true')
        .expect(401)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("error", "wrong username or password");
            done();
          }
        });
    });

    // WRONG
    it('should respond with 401 if password is wrong', function(done) {
      request(app)
        .get('/admin/files/CLAIMID?username=admin&password=wrongpassword')
        .set('Ajax', 'true')
        .expect(401)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("error", "wrong username or password");
            done();
          }
        });
    });

    // WRONG
    it('should respond with 400 if given wrong claim id', function(done) {
      request(app)
        .get('/admin/files/wrongclaimid?username=admin&password=asd')
        .set('Ajax', 'true')
        .expect(404)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("error", "no file directory for this claim id");
            done();
          }
        });
    });

  });

  describe('GET /admin', function() {
    before(seed);
    after(utils.dropDbAndCloseConnection);

    it('should respond with 200 if the request is valid', function(done) {
      request(app)
        .get('/admin')
        .set('Accept', 'text/html')
        .expect(200)
        .end(function(err, res) {
          res.text.indexOf("<title>JobAdvisor - Admin View</title>")
          .should.not.equal(-1);
          done();
        });;
    });

    it('should respond with a 400 if the request does not accept HTML', function(done) {
      request(app)
        .get('/admin')
        .set('Accept', 'application/json')
        .expect(400, done);
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
