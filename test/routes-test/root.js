/** @module test/routes-test/root
* Tests for route /
*/

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

describe('Root test: ', function() {

  describe('GET /', function(){
    before(seed);
    after(utils.dropDbAndCloseConnection);

    it('should respond with a 200 if the request expects text/html', function(done) {
      request(app)
        .get('/')
        .set('Accept', 'text/html')
        .expect('Content-Type', /html/, 'it should respond with html' )
        .expect(200)
        .end(function(err, res) {
          res.text.indexOf('body').should.be.greaterThan(-1);
          done();
        });
    });

    it('should respond with a 404 if the request expects application/json', function(done) {
      request(app)
        .get('/')
        .set('Accept', 'application/json')
        .expect(404, done);
    });

    it('should respond with a 405 if the the method is not GET or OPTIONS', function(done) {
      request(app)
        .post('/')
        .expect(405, done);
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
