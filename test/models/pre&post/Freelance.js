/* tests for constructor and creation of Freelance */
'use strict';

//connect to DB
const mongoose   = require('mongoose');
mongoose.Promise = require('bluebird');

const should = require('should');
const config = require('../../config');
var projectRoot = config.projectRoot;
const utils = require(projectRoot +'/seed_data/utils');


require(projectRoot+ '/models/Freelance');
require(projectRoot + '/models/Review');

describe('Freelance pre&post :', function(done){
	var Freelance = mongoose.model('Freelance');

	before(function(done){
		//connect and drop db
		utils.connectAndDropDb(function(err){
		  if (err) return done(err);
		  done();
	  });
	});
	after(utils.dropDbAndCloseConnection);

	it ('should bound less than 0 avgScore to 0', function(done) {
	  let freelance = new Freelance();
	  freelance.firstName = 'Mark';
	  freelance.familyName = 'Knopfer';
	  freelance.title = 'I am alive yeah';
	  freelance.email = 'ripperoni@pepe.pe';
	  freelance.price = {min: 20, max: 100};
	  freelance.review = [];
	  freelance.tags = [];
	  freelance.avgScore = -32;
	  freelance.save(function(err, saved){
	    should.not.exist(err, 'No error should occur');
	    freelance.avgScore.should.equal(0);
	    done();
	  });
	});

	it ('should bound over 5 avgScore to 5', function(done) {
	  let freelance = new Freelance();
	  freelance.firstName = 'Mark';
	  freelance.familyName = 'Knopfer';
	  freelance.title = 'I am alive yeah';
	  freelance.email = 'ripperoni@pepe.pe';
	  freelance.price = {min: 20, max: 100};
	  freelance.review = [];
	  freelance.tags = [];
	  freelance.avgScore = 500;
	  freelance.save(function(err, saved){
	    should.not.exist(err, 'No error should occur');
	    freelance.avgScore.should.equal(5);
	    done();
	  });
	});

	//TODO test for the avgScore pre

});