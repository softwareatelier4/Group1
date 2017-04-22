'use strict';

var mongoose   = require('mongoose');
var ObjectId   = mongoose.Types.ObjectId;

var should = require('should');
var config = require('../config');
var app = require(config.projectRoot + '/app');
var seedData = require('../../seed_data/seedData');
var seedDb = require('../../seed_data/seedDb');
var utils = require('../../seed_data/utils');
var request = require('supertest');

describe('Claim-post test: ', function() {

  describe('POST /claim', function() {

    before(seed);
    after(utils.dropDb);

    it('app should get answer 400 on POST /claim/new if user is not logged in', function(done) {
      request(app)
      .post('/claim/new')
      .expect(400)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          res.body.should.have.property("error", "no user id or freelancer id");
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
