/* tests for constructor and creation of Tag */
'use strict';

// connect to DB
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const should = require('should');
const config = require('../../config');
const projectRoot = config.projectRoot;
const utils = require(projectRoot +'/seed_data/utils');

require(projectRoot + '/models/Tag');

describe('Tag Model ', function(done) {

  // Tag constructor test
  describe('Tag model definition', function() {
    it('should have a constructor', function() {
      var Tag;
      try {
        Tag = mongoose.model('Tag');
      } catch(err) {
        throw new Error(err);
      } finally {
        should.exist(Tag, 'expected Tag constructor to exist');
        Tag.should.be.a.Function;
      }
    });
  });

  describe('When creating a new tag', function(done) {
    var Tag = mongoose.model('Tag');

    before(function(done) {
      // connect and drop db
      utils.connectAndDropDb(function(err) {
        if (err) return done(err);
        done();
      });
    });

    after(utils.dropDbAndCloseConnection);

    it('should create an instance of the right type', function() {
      var tag = new Tag();
      tag.constructor.name.should.equal('model');
      tag.should.be.instanceof(Tag);
    });

    it('should persist a tag with valid properties', function(done) {
      let tag = new Tag();
      tag.tagName = 'Swift';
      tag.freelancers = [];
      tag.save(function(err, saved) {
        should.not.exist(err, 'No error should occur');
        saved.should.eql(tag);
        done();
      });
    });

    it('should fail if tagName is empty, null, or undefined', function(done) {
      let tag = new Tag();
      tag.freelancers = [];
      utils.errorIfNullUndefinedOrEmpty(tag, 'tagName', done);
    });
  });
});
