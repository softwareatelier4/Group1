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

describe('Freelance-delete test: ', function() {

  describe('DELETE /freelance/:freelanceid', function() {
    before(seed);
    after(utils.dropDbAndCloseConnection);

    it('should delete the freelance with the given id', function(done) {
      request(app)
        .delete('/freelance/' + seedData[1].data[1]._id.toString())
        .set('Accept', 'application/json')
        .set('Ajax', 'true')
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(201)
        .end(function(err, res) {
          var freelance = JSON.parse(res.text) || {};
          freelance.should.have.property("_id", seedData[1].data[1]._id);
          done();
        });
    });

    it('should return 404 when the freelance with the given id is not found', function(done) {
      request(app)
        .delete('/freelance/' + seedData[1].data[1]._id.toString())
        .set('Accept', 'application/json')
        .set('Ajax', 'true')
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(404)
        .end(done);
    });

    it('should delete the freelancer reference from the user', function(done) {
      request(app)
        .delete('/freelance/' + seedData[1].data[0]._id.toString())
        .set('Accept', 'application/json')
        .set('Ajax', 'true')
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(201)
        .end(function(err, res) {
          var freelance = JSON.parse(res.text) || {};
          var user = seedData[4].data[5];
          console.log("MIAO" + user.freelancer);
          // assert(user.freelancers, []);
          // freelance.should.have.property("_id", seedData[4].data[5]._free);
          done();
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
