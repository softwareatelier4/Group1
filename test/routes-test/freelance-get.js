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

  describe('GET /freelance/:freelanceid', function(){
    before(seed);
    after(utils.dropDb);

    it('should list the freelance with correct data', function(done){
      request(app)
        .get('/freelance/' + seedData[0].data[0]._id.toString())
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/, 'it should respond with json' )
        .expect(200)
        .end(function(err, res) {
          var freelance = JSON.parse(res.text) || {};
          freelanceutils.checkFreelanceInfoInResponse(freelance,seedData[0].data[0]);
          done();
        });
    });

  });

});

function seed(done) {
  //seed the db
  seedDb.seed(function(err, seedData){
    if (err) return done(err);
    done();
  });
}
