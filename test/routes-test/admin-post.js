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

    it('should get an error if no categoryName was given', function(done) {
      request(app)
        .post('/admin/category?username=admin&password=asd')
        .set('Ajax', 'true')
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("errors", [ "Path `categoryName` is required." ]);
            done();
          }
        });
    });

    it('should respond with 400 if username is wrong', function(done) {
      request(app)
        .post('/admin/category?username=wrongusername&password=asd')
        .set('Ajax', 'true')
        .expect(400, done);
    });

    it('should respond with 400 if password is wrong', function(done) {
      request(app)
        .post('/admin/category?username=admin&password=wrongpassword')
        .set('Ajax', 'true')
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
