'use strict';

var mongoose   = require('mongoose');
var ObjectId   = mongoose.Types.ObjectId;

var should = require('should');
var config = require('../config');
var app = require(config.projectRoot + '/app');
var seedData = require('../../seed_data/seedData');
var seedDb = require('../../seed_data/seedDb');
var utils = require('../../seed_data/utils');
var freelanceutils = require('./utils');
var request = require('supertest');

describe('Freelance-get test: ', function() {

  describe('GET /freelance/:freelanceid', function() {
    before(seed);
    after(utils.dropDb);

    it('should list the freelance with correct data', function(done) {
      request(app)
        .get('/freelance/' + seedData[0].data[0]._id.toString())
        .set('Accept', 'application/json')
        .set('Ajax', 'true')
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(200)
        .end(function(err, res) {
          var freelance = JSON.parse(res.text) || {};
          freelanceutils.checkFreelanceInfoInResponse(freelance, seedData[0].data[0]);
          done();
        });
    });

    it('should respond with a 404 if the freelance does not exist', function(done) {
      request(app)
        .get('/freelance/' + ObjectId().toString())
        .set('Accept', 'application/json')
        .set('Ajax', 'true')
        .expect(404, done);
    });

    it('should respond with a 400 if the given freelance ID is not valid', function(done) {
      request(app)
        .get('/freelance/' + 'literally_anything_which_is_not_in_the_correct_format')
        .set('Accept', 'application/json')
        .set('Ajax', 'true')
        .expect(400, done);
    });

    it('should respond with a 405 if the method is not GET, PUT, or OPTIONS', function(done) {
      request(app)
        .head('/freelance/' + seedData[0].data[0]._id.toString()) // valid id
        .set('Accept', 'application/json')
        .set('Ajax', 'true')
        .expect(405, done);
    });

    it('should respond with a 200 if the request accepts HTML', function(done) {
      request(app)
        .get('/freelance/' + seedData[0].data[0]._id.toString()) // valid id and method
        .set('Accept', 'text/html')
        .expect(200)
        .end(function(err, res) {
          res.text.indexOf("<title>JobAdvisor</title>").should.not.equal(-1);
          done();
        });
    });

    it('should respond with a 400 if the request is not AJAX and does not accept HTML', function(done) {
      request(app)
        .get('/freelance/' + seedData[0].data[0]._id.toString()) // valid id and method
        .set('Accept', 'application/json')
        .expect(400, done);
    });

  });

  describe('GET /freelance/new', function() {
    before(seed);
    after(utils.dropDb);

    it('it should respond with 200 if the request is valid', function(done) {
      request(app)
        .get('/freelance/new')
        .set('Accept', 'text/html')
        .expect(200)
        .end(function(err, res) {
          res.text.indexOf("<title>JobAdvisor - Create Freelancer Profile</title>")
          .should.not.equal(-1);
          done();
        });
    });

    it('should respond with a 400 if the request does not accept HTML', function(done) {
      request(app)
        .get('/freelance/new')
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
