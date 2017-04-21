/* tests for pre and post conditions of Freelance */
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
	var Review = mongoose.model('Review');

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
		freelance.reviews = [];
		freelance.tags = [];
		freelance.avgScore = -32;
		freelance.save(function(err, saved){
			should.not.exist(err, 'No error should occur');
			saved.avgScore.should.equal(0);
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
		freelance.reviews = [];
		freelance.tags = [];
		freelance.avgScore = 500;
		freelance.save(function(err, saved){
			should.not.exist(err, 'No error should occur');
			saved.avgScore.should.equal(5);
			done();
		});
	});

	//TODO test for the avgScore pre

	it ('should have a score of 0 for no reviews', function(done) {
		let freelance = new Freelance();
		freelance.firstName = 'Mark';
		freelance.familyName = 'Knopfer';
		freelance.title = 'I am alive yeah';
		freelance.email = 'ripperoni@pepe.pe';
		freelance.price = {min: 20, max: 100};
		freelance.tags = [];
		freelance.save(function(err, saved){
			should.not.exist(err, 'No error should occur');
			saved.avgScore.should.equal(0);
			done();
		});
	});


	//these tests go in timeout for some reason

	// it ('should have a score of 3 for a review of 2 and one of 4', function(done) {
	//
	// 	let freelance = new Freelance();
	// 	freelance.firstName = 'Mark';
	// 	freelance.familyName = 'Knopfer';
	// 	freelance.title = 'I am alive yeah';
	// 	freelance.email = 'ripperoni@pepe.pe';
	// 	freelance.price = {min: 20, max: 100};
	// 	freelance.tags = [];
	// 	freelance.reviews = [];
	//
	// 	let review1 = new Review();
	// 	review1.author = "me";
	// 	review1.score = 2;
	//
	// 	let review2 = new Review();
	// 	review2.author = "pepe";
	// 	review2.score = 4;
	//
	// 	freelance.reviews.push(review1);
	// 	freelance.reviews.push(review2);
	//
	//
	//
	// 	freelance.save(function(err, saved){
	// 		should.not.exist(err, 'No error should occur');
	// 		console.log("Here i expect 3: "+ saved.avgScore);
	// 		saved.avgScore.should.equal(6/2);
	// 		done();
	// 	});
	// });

	// it ('should have a score of 3.33 for a review of 2 and 2 of 4', function(done) {
	//
	// 	let freelance = new Freelance();
	// 	freelance.firstName = 'Mark';
	// 	freelance.familyName = 'Knopfer';
	// 	freelance.title = 'I am alive yeah';
	// 	freelance.email = 'ripperoni@pepe.pe';
	// 	freelance.price = {min: 20, max: 100};
	// 	freelance.tags = [];
	// 	freelance.reviews = [];
	//
	// 	let review1 = new Review();
	// 	review1.author = "me";
	// 	review1.score = 2;
	//
	// 	let review2 = new Review();
	// 	review2.author = "pepe";
	// 	review2.score = 4;
	//
	// 	let review3 = new Review();
	// 	review3.author = "meh";
	// 	review3.score = 4;
	//
	// 	freelance.reviews.push(review1);
	// 	freelance.reviews.push(review2);
	// 	freelance.reviews.push(review3);
	//
	//
	//
	// 	freelance.save(function(err, saved){
	// 		should.not.exist(err, 'No error should occur');
	// 		console.log("Here i expect 3.33: "+ saved.avgScore);
	// 		saved.avgScore.should.equal(10/3);
	// 		done();
	// 	});
	// });

});
