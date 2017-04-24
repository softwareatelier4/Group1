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

describe('Admin-post test: ', function() {

  describe('POST /admin/category', function() {
    before(seed);
    after(utils.dropDbAndCloseConnection);

    it('should get answer 201 on POST /admin/category', function(done) {
      request(app)
        .post('/admin/category?username=admin&password=asd')
        .send({
          categoryName : 'testCategory'
        })
        .set('Ajax', 'true')
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(201)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("categoryName", "testCategory");
            done();
          }
        });
    });

    it('should respnd with 400 if no categoryName was given', function(done) {
      request(app)
        .post('/admin/category?username=admin&password=asd')
        .set('Ajax', 'true')
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("error", "no category name given");
            done();
          }
        });
    });

    it('should respond with 401 if username is wrong', function(done) {
      request(app)
        .post('/admin/category?username=wrongusername&password=asd')
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
        .post('/admin/category?username=admin&password=wrongpassword')
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

});

function seed(done) {
  //seed the db
  seedDb.seed(function(err, seedData) {
    if (err) return done(err);
    done();
  });
}
