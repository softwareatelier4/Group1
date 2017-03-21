/** @module test/routes-test/category
* Tests for route /category/
*/

'use strict';

const mongoose   = require('mongoose');
const ObjectId   = mongoose.Types.ObjectId;
const Category = mongoose.model('Category');

const should = require('should');
const config = require('../config');
const app = require(config.projectRoot + '/app');
const seedData = require('../../seed_data/seedData');
const seedDb = require('../../seed_data/seedDb');
const utils = require('../../seed_data/utils');
const routersutils = require('./utils');
const request = require('supertest');

describe('Category test: ', function() {

  describe('GET /category/', function() {

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
        .post('/category/')
        .expect(405, done);
    });

    it('should respond with a 404 if there are no categories', function(done) {
      Category.remove().exec(function() {
        request(app)
          .get('/category/')
          .set('Accept', 'application/json')
          .expect(404, done);
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
