/** @module test/routes-test/category
* Tests for route /category/
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
var routersutils = require('./utils');
var request = require('supertest');

describe('Category test: ', function() {

  describe('GET /category/', function(){

    it('should respond with a 404 if there are no categories', function(done) {
      request(app)
        .get('/')
        .set('Accept', 'application/json')
        .expect(404, done);
    });
    
    before(seed);
    after(utils.dropDb);

    it('should respond with a 200 and return correct data', function(done) {
      request(app)
        .get('/category/')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/, 'it should respond with json' )
        .expect(200)
        .end(function(err, res) {
          var categories = JSON.parse(res.text) || {};
          categories.forEach(function(category) {
            routersutils.checkCategoryInfoInResponse(category, seedData[3].data[0]);
          });
          done();
        });
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
