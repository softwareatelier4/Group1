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

describe('Admin-put test: ', function() {

  describe('PUT /admin/category', function() {
    before(seed);
    after(utils.dropDbAndCloseConnection);

    it('should respond with 204 if request is valid', function(done) {
      request(app)
        .put('/admin/category?username=admin&password=asd&id=' + seedData[3].data[0]._id)
        .send({
          categoryName : "testName"
        })
        .set('Ajax', 'true')
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(201)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("categoryName", "testName");
            done();
          }
        });
    });

    it('should respond with 500 if invalid category is given', function(done) {
      request(app)
        .put('/admin/category?username=admin&password=asd&id=invalidcategory')
        .set('Ajax', 'true')
        .expect(500)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("error", "database error while finding and updating category");
            done();
          }
        });
    });

    it('should respond with 404 if category not found', function(done) {
      request(app)
        .put('/admin/category?username=admin&password=asd&id=000000000000000000000000')
        .set('Ajax', 'true')
        .expect(404)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("error", "category not found");
            done();
          }
        });
    });

    it('should respond with 401 if no id is given', function(done) {
      request(app)
        .put('/admin/category?username=admin&password=asd')
        .set('Ajax', 'true')
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("error", "no category id given");
            done();
          }
        });
    });

    it('should respond with 401 if username is wrong', function(done) {
      request(app)
        .put('/admin/category?username=wrongusername&password=asd')
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
        .put('/admin/category?username=admin&password=wrongpassword')
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
