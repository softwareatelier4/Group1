'use strict';

const mongoose   = require('mongoose');
const ObjectId   = mongoose.Types.ObjectId;
const assert = require('assert');
const should = require('should');
const config = require('../config');
const app = require(config.projectRoot + '/app');
const seedData = require('../../seed_data/seedData');
const seedDb = require('../../seed_data/seedDb');
const utils = require('../../seed_data/utils');
const freelanceutils = require('./utils');
const request = require('supertest');
const freelancerAvailableDay = require('../../routes/search/router').freelancerAvailableDay;

describe('Search test: ', function() {

  describe('GET /search?keyword=', function() {
    before(seed);
    after(utils.dropDbAndCloseConnection);

    it('Should respond with a 200 and return the correct data', function(done) {
      request(app)
        .get('/search?keyword=larson')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(200)
        .end(function(err, res) {
          const results = JSON.parse(res.text) || [];
          results.length.should.be.greaterThan(0);
          results.forEach(function(freelance) {
            freelanceutils.checkSearchInfoInResponse(freelance, seedData[1].data[0]);
            freelance.should.have.property("distance", Number.MAX_SAFE_INTEGER);
            freelance.should.have.property("duration", Number.MAX_SAFE_INTEGER);
          });
          done();
        });
    });

    it('Should respond with a 200 and return the correct data with distance information', function(done) {
      request(app)
        .get('/search?keyword=larson&origin=Bellinzona+Switzerland')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(200)
        .end(function(err, res) {
          const results = JSON.parse(res.text) || [];
          results.length.should.be.greaterThan(0);
          results.forEach(function(freelance) {
            freelanceutils.checkSearchInfoInResponse(freelance, seedData[1].data[0]);
            freelance.should.have.property("distance");
            freelance.distance.should.not.be.lessThan(0);
            freelance.distance.should.not.be.greaterThan(Number.MAX_SAFE_INTEGER);
            freelance.should.have.property("duration");
            freelance.duration.should.not.be.lessThan(0);
            freelance.duration.should.not.be.greaterThan(Number.MAX_SAFE_INTEGER);
          });
          done();
        });
    });

    it('Should respond with a 200 and return the correct data with emergency information', function(done) {
      var today = new Date();
      today.setHours(9);
      today.toUTCString()
      request(app)
        .get(`/search?keyword=Roger%20Willie%20Victor&origin=Bellinzona+Switzerland&date=${today}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(200)
        .end(function(err, res) {
          var availabilityCount = 0;
          const results = JSON.parse(res.text) || [];
          results.length.should.be.greaterThan(0);
          results.forEach(function(freelance, i) {
            // freelanceutils.checkSearchInfoInResponse(freelance, seedData[1].data[0], true);
            freelance.should.have.property("emergency");
            freelance.emergency.duration.should.not.be.lessThan(0);
            freelance.emergency.duration.should.not.be.greaterThan(Number.MAX_SAFE_INTEGER);
            freelance.emergency.distance.should.not.be.lessThan(0);
            freelance.emergency.duration.should.not.be.greaterThan(Number.MAX_SAFE_INTEGER);
            if (freelance.emergency.available) {
              freelance.emergency.distance.should.be.lessThan(Number.MAX_SAFE_INTEGER);
              freelance.emergency.duration.should.be.lessThan(Number.MAX_SAFE_INTEGER);
              availabilityCount++;
            }
          });
          availabilityCount.should.be.greaterThan(1);
          done();
        });
    });

    it('Should respond with a 200 and return the correct data with distance information', function(done) {
      request(app)
        .get('/search?keyword=larson&origin=Lugano+Switzerland')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(200)
        .end(function(err, res) {
          const results = JSON.parse(res.text) || [];
          results.length.should.be.greaterThan(0);
          results.forEach(function(freelance) {
            freelanceutils.checkSearchInfoInResponse(freelance, seedData[1].data[0]);
            freelance.should.have.property("distance");
            freelance.distance.should.not.be.lessThan(0);
            freelance.distance.should.not.be.greaterThan(Number.MAX_SAFE_INTEGER);
            freelance.should.have.property("duration");
            freelance.duration.should.not.be.lessThan(0);
            freelance.duration.should.not.be.greaterThan(Number.MAX_SAFE_INTEGER);
          });
          done();
        });
    });

    it('Should respond with a 200 and return multiple results for "Mar"', function(done) {
      request(app)
        .get('/search?keyword=Mar')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(200)
        .end(function(err, res) {
          const results = JSON.parse(res.text) || [];
          results.length.should.be.greaterThan(1);
          done();
        });
    });

    it('should respond with a 200 even if there are no results', function(done) {
      request(app)
        .get('/search?keyword=a_string_that_will_never_be_found_anywhere')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          const results = JSON.parse(res.text);
          results.should.be.empty;
          done();
        });
    });

    it('should respond with a 200 even if there is no keyword given', function(done) {
      request(app)
        .get('/search')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          const results = JSON.parse(res.text);
          results.should.be.not.empty;
          done();
        });
    });

    it('should respond with a 200 and search among all fields', function(done) {
      request(app)
        .get('/search?keyword=ale')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          const results = JSON.parse(res.text);
          results.forEach(function(result) {
            JSON.stringify(result).should.containEql("ale");
          });
          done();
        });
    });

    it('should respond with a 200 and parse a single string to fit a global filter', function(done) {
      request(app)
        .get('/search?keyword=ilarson0@cnbc.com+lalexander2@netlog.com')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          res.text.should.containEql("ilarson0@cnbc.com");
          res.text.should.containEql("lalexander2@netlog.com");
          done();
        });
    });

    it('should respond with a 405 if the method is not GET or OPTIONS', function(done) {
      request(app)
        .head('/search/')
        .set('Accept', 'application/json')
        .expect(405, done);
    });

  });

  describe('freelancerAvailableDay', function() {

    let d1 = '2017-04-03T12:10:00Z';
    let d2 = '2017-04-05T12:10:00Z';
    let d3 = '2017-04-07T12:10:00Z';
    let d4 = '2017-04-06T13:10:00Z';
    let d5 = '2017-04-06T12:10:00Z';

    let f1 =  {
      availability: []
    }

    let f2 =  {
      availability: [
        {
          begin : '2017-04-04T12:00:00Z',
          end   : '2017-04-04T12:20:00Z'
        },
        {
          begin : '2017-04-06T12:00:00Z',
          end   : '2017-04-06T12:20:00Z'
        }
      ]
    }

    it('should return null if freelancer is not available', function(done) {
      should.not.exists(freelancerAvailableDay(f1, d1));
      done();
    });

    it('should return null if freelancer only available later', function(done) {
      should.not.exists(freelancerAvailableDay(f2, d1));
      done();
    });

    it('should return null if freelancer only available another date', function(done) {
      should.not.exists(freelancerAvailableDay(f2, d2));
      done();
    });

    it('should return null if freelancer only available before', function(done) {
      should.not.exists(freelancerAvailableDay(f2, d3));
      done();
    });

    it('should return null if freelancer only available another hour', function(done) {
      should.not.exists(freelancerAvailableDay(f2, d4));
      done();
    });

    it('should return not null if freelancer is available', function(done) {
      should.exists(freelancerAvailableDay(f2, d5));
      done();
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
