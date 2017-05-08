/* tests for constructor and creation of Review */
'use strict';

//connect to DB
const mongoose   = require('mongoose');
mongoose.Promise = require('bluebird');

const should = require('should');
const config = require('../../config');
var projectRoot = config.projectRoot;
const utils = require(projectRoot +'/seed_data/utils');
const modelsutils = require('../utils');

require(projectRoot + '/models/Review');

describe('REVIEW : ', function(done){

  // Freelance constructor test
  describe('Review model definition', function() {
    it('should have a constructor', function() {
      var Review;
      try {
        Review = mongoose.model('Review');
      } catch(err) {
        console.log(err.stack);
      } finally {
        should.exist(Review, 'expected Review constructor to exist');
        Review.should.be.a.Function;
      }
    })
  });

  describe('When creating a new review', function(done) {
    var Review = mongoose.model('Review');
    // var freelance;

    before(function(done){
      //connect and drop db
      utils.connectAndDropDb(function(err) {
        if (err) return done(err);
      done();
      });
    });

    after(utils.dropDbAndCloseConnection);

    it('should create an instance of the right type', function() {
      var review = new Review();
      review.constructor.name.should.equal('model');
      review.should.be.instanceof(Review);
    });

    it ('should persist a review with valid properties', function(done) {
      let review = new Review();
      review.author = 'Bob Knopfler';
      review.title = 'Sweet product';
      review.text = 'GG, well played';
      review.score = 4;
      review.date = Date.now();
      review.save(function(err, saved){
        should.not.exist(err, 'No error should occur');
				// let review1 = new Review();
	      // review1.author = 'Mordekaiser';
	      // review1.title = 'es el numero uno';
	      // review1.text = 'heuhuehuehue';
	      // review1.score = 4;
	      // review1.date = Date.now();
				// review1.reply = saved._id;
				// review1.save(function(err, savedReview){
				// 	savedReview.should.eql(review1);
				saved.should.eql(review);
					done();
				// });
      });
    });

    it('should fail if author is empty, null, or undefined', function(done) {
		  let review = new Review();
      review.title = 'Sweet product';
      review.text = 'GG, well played';
      review.score = 4;
      review.date = Date.now();
      utils.errorIfNullUndefinedOrEmpty(review, 'author', done );
    });

    it('should fail if title is empty, null, or undefined', function(done) {
  	  let review = new Review();
  	  review.author = 'Bob Knopfler';
  	  review.title = 'Sweet product';
  	  review.text = 'GG, well played';
  	  review.date = Date.now();
      utils.errorIfNullUndefinedOrEmpty(review, 'score', done );
    });

    it('if date is empty; null; or undefined, it should get assigned the value Date.now ± 1s',
      function(done){
		  let review = new Review();
		  review.author = 'Bob Knopfler';
		  review.title = 'Sweet product';
		  review.text = 'GG, well played';
		  review.score = 1;
      modelsutils.checkDateCreatedWithin(review, 'date', 1000, done);
    });

		it('should fail if reply points to an invalid ObjectID',
			function(done){
			let review = new Review();
			review.author = 'Bob Knopfler';
			review.title = 'Sweet product';
			review.text = 'GG, well played';
			review.score = 1;
			review.reply = 'asd';
			review.save(function(err, saved){
        should.exist(err);
        done();
      });
		});

  });
});
