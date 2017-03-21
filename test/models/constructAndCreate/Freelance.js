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

describe('Freelance Model ', function(done){

  // Freelance constructor test
  describe('Freelance model definition', function(){
    it('should have a constructor', function(){
      var Freelance;
      try{
        Freelance = mongoose.model('Freelance');
      }catch(err){
        console.log(err.stack);
      }finally{
        should.exist(Freelance, 'expected Freelance constructor to exist');
        Freelance.should.be.a.Function;
      }
    })
  });

  describe('When creating a new freelance', function(done){
    var Freelance = mongoose.model('Freelance');
    // var freelance;

    before(function(done){
      //connect and drop db
      utils.connectAndDropDb(function(err){
        if (err) return done(err);
      done();

    //     freelance = new Freelance({
    //       name : 'Mark Knopfler',
    //       email : 'ripperoni@pepe.pe'
    //     });

    //     freelance.save(function(err,save){
    //       if (err) return done(err);
    //     });
      });
    });

    after(utils.dropDbAndCloseConnection);

    it('should create an instance of the right type', function() {
      var freelance = new Freelance();
      freelance.constructor.name.should.equal('model');
      freelance.should.be.instanceof(Freelance);
    });

    it ('should persist a freelance with valid properties', function(done) {
      let freelance = new Freelance();
      freelance.firstName = 'Mark';
      freelance.familyName = 'Knopfer';
      freelance.title = 'I am alive yeah';
      freelance.email = 'ripperoni@pepe.pe';
      freelance.price = {min: 20, max: 100};
      freelance.review = [];
      freelance.tags = [];
      freelance.save(function(err, saved){
        should.not.exist(err, 'No error should occur');
        saved.should.eql(freelance);
        done();
      });
    });

    it('should fail if firstName is empty, null, or undefined', function(done) {
      let freelance = new Freelance();
      freelance.firstName = "suka";
      freelance.title = 'I am alive yeah';
      freelance.email = 'ripperoni@pepe.pe';
      utils.errorIfNullUndefinedOrEmpty(freelance, 'firstName', done );
    });

        it('should fail if title is empty, null, or undefined', function(done) {
      let freelance = new Freelance();
      freelance.firstName = "Bob";
      freelance.title = null;
      freelance.email = "hue@lul.ch";
      utils.errorIfNullUndefinedOrEmpty(freelance, 'title', done );
    });

      it('should fail if email is empty, null, or undefined', function(done) {
      let freelance = new Freelance();
      freelance.firstName = "Bob";
      freelance.title = "photographer"
      freelance.email = "";
      utils.errorIfNullUndefinedOrEmpty(freelance, 'email', done );
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

      it('if reviews is empty; null; or undefined, it should get assigned the value []',
      function(done){
      let freelance = new Freelance();
      freelance.firstName = 'Mark';
      freelance.familyName = 'Knopfer';
      freelance.title = 'I am alive yeah';
      freelance.email = 'ripperoni@pepe.pe';
      freelance.price = {min: 20, max: 100};
      freelance.tags = [];
      freelance.avgScore = 0;
      freelance.save(function(err, saved){
        should.not.exist(err, 'No error should occur');
        freelance.reviews.isMongooseArray.should.equal(true);
        done();
      });
    });

      it('if tags is empty; null; or undefined, it should get assigned the value []',
      function(done){
      let freelance = new Freelance();
      freelance.firstName = 'Mark';
      freelance.familyName = 'Knopfer';
      freelance.title = 'I am alive yeah';
      freelance.email = 'ripperoni@pepe.pe';
      freelance.price = {min: 20, max: 100};
      freelance.review = [];
      freelance.avgScore = 0;
      freelance.save(function(err, saved){
        should.not.exist(err, 'No error should occur');
        freelance.tags.isMongooseArray.should.equal(true);
        done();
      });
    });

  });
});
