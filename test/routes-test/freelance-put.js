'use strict';

var mongoose   = require('mongoose');
var ObjectId   = mongoose.Types.ObjectId;

var should = require('should');
var config = require('../config');
var app = require(config.projectRoot + '/app');
var seedDb = require('../../seed_data/seedDb');
var utils = require('../../seed_data/utils');
var request = require('supertest');

describe('Freelance-put test: ', function() {

  describe('PUT /freelance/:freelanceid/availability', function() {
    before(seed);
    after(utils.dropDbAndCloseConnection);

    // CORRECT: PUT: /freelance/:id/availability with existing id
    it('should respond with 204 and update availability correctly for existing freelancer', function(done) {
      let data = [];
      data.push({
        "day" : new Date(),
        "begin" : new Date(),
        "end" : new Date(),
        "location" : "behind you"
      });
      data.push({
        "day" : new Date(),
        "begin" : new Date(),
        "end" : new Date(),
        "location" : "Hawaii"
      });

      request(app)
      .put('/freelance/58cc4941fc13ae612c00000a/availability')
      .set('Accept', 'application/json')
      .send(data)
      .expect(204)
      .end(done);
    });

    // ERROR: PUT: /freelance/:id/availability with non-existing id
    it('should respond with 404 for non-existing freelancer', function(done) {
      let data = [];
      data.push({
        "day" : new Date(),
        "begin" : new Date(),
        "end" : new Date(),
        "location" : "behind you"
      });
      data.push({
        "day" : new Date(),
        "begin" : new Date(),
        "end" : new Date(),
        "location" : "Hawaii"
      });

      request(app)
      .put('/freelance/' + new ObjectId() + '/availability')
      .set('Accept', 'application/json')
      .send(data)
      .expect(404)
      .end(done);
    });

    // ERROR: PUT: /freelance/:id/availability wrong data in body
    it('should respond with 400 if body does not contain an array of Days', function(done) {
      let data = [];
      data.push({
        "day" : new Date(),
        "begin" : new Date(),
        "end" : new Date(),
        "location" : 1
      });

      request(app)
      .put('/freelance/58cc4941fc13ae612c00000a/availability')
      .set('Accept', 'application/json')
      .send(data)
      .expect(400)
      .end(done);
    });

    // ERROR: GET: /freelance/:id/availability unsupported method
    it('should respond with a 405 if the method is not PUT or OPTIONS', function(done) {
      let data = [];
      data.push({
        "day" : new Date(),
        "begin" : new Date(),
        "end" : new Date(),
        "location" : "behind you"
      });
      data.push({
        "day" : new Date(),
        "begin" : new Date(),
        "end" : new Date(),
        "location" : "Hawaii"
      });

      request(app)
      .get('/freelance/58cc4941fc13ae612c00000a/availability')
      .set('Accept', 'application/json')
      .send(data)
      .expect(405)
      .end(done);
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
