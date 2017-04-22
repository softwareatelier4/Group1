/* tests for constructor and creation of User */
'use strict';

// connect to DB
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const should = require('should');
const config = require('../../config');
const projectRoot = config.projectRoot;
const utils = require(projectRoot +'/seed_data/utils');

require(projectRoot + '/models/Claim');
require(projectRoot + '/models/User');
require(projectRoot + '/models/Freelance');

describe('CLAIM : ', function(done) {

  // User constructor test
  describe('Claim model definition', function() {
    it('should have a constructor', function() {
      var Claim;
      try {
        Claim = mongoose.model('Claim');
      } catch(err) {
        throw new Error(err);
      } finally {
        should.exist(Claim, 'expected Claim constructor to exist');
        Claim.should.be.a.Function;
      }
    });
  });

  describe('When creating a new claim', function(done) {
    var Claim = mongoose.model('Claim');


    before(function(done) {
      // connect and drop db
      utils.connectAndDropDb(function(err) {
        if (err) return done(err);
        done();
      });
    });

    after(utils.dropDbAndCloseConnection);

    it('should create an instance of the right type', function() {
      var claim = new Claim();
      claim.constructor.name.should.equal('model');
      claim.should.be.instanceof(Claim);
    });

    it('should persist a claim with valid properties', function(done) {
			var Freelance = mongoose.model('Freelance');
			var User = mongoose.model('User');

			let freelance = new Freelance();
			freelance.firstName = 'Mark';
			freelance.familyName = 'Knopfer';
			freelance.title = 'I am alive yeah';
			freelance.email = 'ripperoni@pepe.pe';
			freelance.price = {min: 20, max: 100};
			freelance.tags = [];
			freelance.save(function(err, freelance){
				should.not.exist(err, 'No error should occur');

				let user = new User();
				user.username = 'Lanaya';
				user.password = 'vivaimorti';
				user.email = 'supersecret';
				user.save(function(err, user) {
					should.not.exist(err, 'No error should occur');

					let claim = new Claim();
					claim.userID = user._id;
					claim.freelanceID = freelance._id;
					claim.save(function(err, saved) {
						should.not.exist(err, 'No error should occur');

						saved.userID.should.eql(user._id);

						saved.freelanceID.should.eql(freelance._id);
						done();
					});
				});
			});



    });


		//need to look into why these fail

		it('should fail if freelanceID is empty, null, or undefined', function(done) {
			var User = mongoose.model('User');

			let user = new User();
			user.username = 'Lanaya';
			user.password = 'vivaimorti';
			user.email = 'supersecret';
			user.save(function(err, user) {
				should.not.exist(err, 'No error should occur');

				let claim = new Claim();
				claim.userID = user._id;
				utils.errorIfNullUndefinedOrEmpty(claim, 'freelanceID', done);
					done();
			});

		});

		it('should fail if freelanceID is empty, null, or undefined', function(done) {
			var Freelance = mongoose.model('Freelance');
			var User = mongoose.model('User');

			let freelance = new Freelance();
			freelance.firstName = 'Mark';
			freelance.familyName = 'Knopfer';
			freelance.title = 'I am alive yeah';
			freelance.email = 'ripperoni@pepe.pe';
			freelance.price = {min: 20, max: 100};
			freelance.tags = [];
			freelance.save(function(err, freelance){
				should.not.exist(err, 'No error should occur');

				let claim = new Claim();
				claim.freelanceID = freelance._id;

				utils.errorIfNullUndefinedOrEmpty(claim, 'freelanceID', done);
				done();
			});
		});

	});
});
