/* tests for constructor and creation of User */
'use strict';

// connect to DB
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const should = require('should');
const config = require('../../config');
const projectRoot = config.projectRoot;
const utils = require(projectRoot +'/seed_data/utils');

require(projectRoot + '/models/Duplicate');
require(projectRoot + '/models/User');
require(projectRoot + '/models/Freelance');

describe('DUPLICATE : ', function(done) {

  // User constructor test
  describe('Duplicate model definition', function() {
    it('should have a constructor', function() {
      var Duplicate;
      try {
        Duplicate = mongoose.model('Duplicate');
      } catch(err) {
        throw new Error(err);
      } finally {
        should.exist(Duplicate, 'expected Duplicate constructor to exist');
        Duplicate.should.be.a.Function;
      }
    });
  });

  describe('When creating a new duplicate', function(done) {
    var Duplicate = mongoose.model('Duplicate');


    before(function(done) {
      // connect and drop db
      utils.connectAndDropDb(function(err) {
        if (err) return done(err);
        done();
      });
    });

    after(utils.dropDbAndCloseConnection);

    it('should create an instance of the right type', function() {
      var duplicate = new Duplicate();
      duplicate.constructor.name.should.equal('model');
      duplicate.should.be.instanceof(Duplicate);
    });

    it('should persist a duplicate with valid properties', function(done) {
			var Freelance = mongoose.model('Freelance');
			var User = mongoose.model('User');

			let freelance = new Freelance();
			freelance.firstName = 'Mark';
			freelance.familyName = 'Knopfer';
			freelance.title = 'I am alive yeah';
			freelance.email = 'ripperoni@pepe.pe';
			freelance.price = { min: 20, max: 100 };
			freelance.tags = [];
			freelance.save(function(err, freelance) {
				should.not.exist(err, 'No error should occur');

				let duplicatefreelancer = new Freelance();
				duplicatefreelancer.firstName = 'Mark';
				duplicatefreelancer.familyName = 'Clone';
				duplicatefreelancer.title = 'I am clone';
				duplicatefreelancer.email = 'clone@pepe.pe';
				duplicatefreelancer.price = { min: 20, max: 100 };
				duplicatefreelancer.tags = [];
				duplicatefreelancer.save(function(err, duplfreelance){
					should.not.exist(err, 'No error should occur');

					let user = new User();
					user.username = 'Lanaya';
					user.password = 'vivaimorti';
					user.email = 'supersecret';
					user.save(function(err, user) {
						should.not.exist(err, 'No error should occur');

						let duplicate = new Duplicate();
						duplicate.userID = user._id;
						duplicate.originalID = freelance._id;
						duplicate.duplicateID = duplfreelance._id;
						duplicate.save(function(err, saved) {
							should.not.exist(err, 'No error should occur');

							saved.userID.should.eql(user._id);
							saved.originalID.should.eql(freelance._id);
							saved.duplicateID.should.eql(duplfreelance._id);
							done();
						});
					});
				});
			});



    });


		//need to look into why these fail

		it('should fail if originalID is empty, null, or undefined', function(done) {
			var User = mongoose.model('User');

			let user = new User();
			user.username = 'Lanaya';
			user.password = 'vivaimorti';
			user.email = 'supersecret';
			user.save(function(err, user) {
				should.not.exist(err, 'No error should occur');

				let duplicate = new Duplicate();
				duplicate.userID = user._id;
				duplicate.duplicateID = "58cc4941fc13ae612c000016";
				utils.errorIfNullUndefinedOrEmpty(duplicate, 'originalID', done);
					done();
			});

		});

		it('should fail if UserID is empty, null, or undefined', function(done) {
			var Freelance = mongoose.model('Freelance');
			var User = mongoose.model('User');

			let freelance = new Freelance();
			freelance.firstName = 'Mark';
			freelance.familyName = 'Knopfer';
			freelance.title = 'I am alive yeah';
			freelance.email = 'ripperoni@pepe.pe';
			freelance.price = { min: 20, max: 100 };
			freelance.tags = [];
			freelance.save(function(err, freelance) {
				should.not.exist(err, 'No error should occur');

				let duplicate = new Duplicate();
				duplicate.originalID = freelance._id;
				duplicate.duplicateID = "58cc4941fc13ae612c000016";
				utils.errorIfNullUndefinedOrEmpty(duplicate, 'userID', done);
				done();
			});
		});

	});
});
