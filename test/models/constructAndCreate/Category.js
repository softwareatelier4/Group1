/* tests for constructor and creation of Category */
'use strict';

// connect to DB
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const should = require('should');
const config = require('../../config');
const projectRoot = config.projectRoot;
const utils = require(projectRoot +'/seed_data/utils');

require(projectRoot + '/models/Category');

describe('CATEGORY : ', function(done) {

  // Category constructor test
  describe('Category model definition', function() {
    it('should have a constructor', function() {
      var Category;
      try {
        Category = mongoose.model('Category');
      } catch(err) {
        throw new Error(err);
      } finally {
        should.exist(Category, 'expected Category constructor to exist');
        Category.should.be.a.Function;
      }
    });
  });

  describe('When creating a new category', function(done) {
    var Category = mongoose.model('Category');

    before(function(done) {
      // drop db
      utils.dropDb(function(err) {
        if (err) return done(err);
        done();
      });
    });

    after(utils.dropDbAndCloseConnection);

    it('should create an instance of the right type', function() {
      var category = new Category();
      category.constructor.name.should.equal('model');
      category.should.be.instanceof(Category);
    });

    it('should persist a category with valid properties', function(done) {
      let category = new Category();
      category.categoryName = 'Swift';
      category.freelancers = [];
      category.save(function(err, saved) {
        should.not.exist(err, 'No error should occur');
        saved.should.eql(category);
        done();
      });
    });

		it('should create a category with required documents', function(done) {
			let category = new Category();
			category.categoryName = 'Swift';
			category.freelancers = [];
			category.requiresDocs = true;
			category.save(function(err, saved) {
				should.not.exist(err, 'No error should occur');
				saved.requiresDocs.should.equal(true);
				done();
			});
		});

    it('should fail if categoryName is empty, null, or undefined', function(done) {
      let category = new Category();
      category.freelancers = [];
      utils.errorIfNullUndefinedOrEmpty(category, 'categoryName', done);
    });
  });
});
