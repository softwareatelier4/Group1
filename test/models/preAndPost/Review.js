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


describe('Review pre&post :', function(done){
	var Review = mongoose.model('Review');

	before(function(done){
		//connect and drop db
		utils.connectAndDropDb(function(err){
		  if (err) return done(err);
		  done();
	  });
	});
	after(utils.dropDbAndCloseConnection);

	it ('should bound over 5 avgScore to 5', function(done) {
		let review = new Review();
		review.author = 'Bob Knopfler';
		review.title = 'Sweet product';
		review.text = 'GG, well played';
		review.score = 6;
		review.date = Date.now();
    review.save(function(err, saved){
      should.not.exist(err, 'No error should occur');
      review.score.should.equal(5);
      done();
    });
   });

	it ('should bound less than 0 avgScore to 0', function(done) {
		  let review = new Review();
		  review.author = 'Bob Knopfler';
		  review.title = 'Sweet product';
		  review.text = 'GG, well played';
		  review.score = -2;
		  review.date = Date.now();
      review.save(function(err, saved){
        should.not.exist(err, 'No error should occur');
        review.score.should.equal(0);
        done();
      });
    });

	it('if text is bigger than 1000 characters, it should be saved as only the first 1000 characters',
  	function(done){
  		let review = new Review();
  		review.author = 'Bob Knopfler';
  		review.title = 'Sweet product';
  		review.text = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. N AAAAA';
  		review.score = 4;
    	review.save(function(err, saved){
    	  should.not.exist(err, 'No error should occur');
    	  review.text.should.equal('Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. ');
    	  done();
    	});
    });

});