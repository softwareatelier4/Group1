/* tests for constructor and creation of User */
'use strict';

// connect to DB
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const should = require('should');
const config = require('../../config');
const projectRoot = config.projectRoot;
const utils = require(projectRoot +'/seed_data/utils');

require(projectRoot + '/models/User');

describe('USER : ', function(done) {

  // User constructor test
  describe('User model definition', function() {
    it('should have a constructor', function() {
      var User;
      try {
        User = mongoose.model('User');
      } catch(err) {
        throw new Error(err);
      } finally {
        should.exist(User, 'expected User constructor to exist');
        User.should.be.a.Function;
      }
    });
  });

  describe('When creating a new user', function(done) {
    var User = mongoose.model('User');

    before(function(done) {
      // connect and drop db
      utils.connectAndDropDb(function(err) {
        if (err) return done(err);
        done();
      });
    });

    after(utils.dropDbAndCloseConnection);

    it('should create an instance of the right type', function() {
      var user = new User();
      user.constructor.name.should.equal('model');
      user.should.be.instanceof(User);
    });

    it('should persist a user with valid properties', function(done) {
      let user = new User();
      user.username = 'Lanaya';
      user.password = 'vivaimorti';
      user.email = 'supersecret';
      user.save(function(err, saved) {
        should.not.exist(err, 'No error should occur');
        saved.should.eql(user);
        done();
      });
    });

    it('should fail if username is empty, null, or undefined', function(done) {
      let user = new User();
      user.password = 'vivaimorti';
      user.email = 'supersecret';
      utils.errorIfNullUndefinedOrEmpty(user, 'username', done);
    });

    it('should fail if password is empty, null, or undefined', function(done) {
      let user = new User();
      user.username = 'Lanaya';
      user.email = 'supersecret';
      utils.errorIfNullUndefinedOrEmpty(user, 'password', done);
    });

    it('should fail if email is empty, null, or undefined', function(done) {
      let user = new User();
      user.username = 'Lanaya';
      user.password = 'vivaimorti';
      utils.errorIfNullUndefinedOrEmpty(user, 'email', done);
    });
  });
});
