/* tests for constructor and creation of Freelance */

//connect to DB
const mongoose   = require('mongoose');
mongoose.Promise = require('bluebird'); 

const should = require('should');
const utils = require('../utils');
const config = require('../../config');

var projectRoot = config.projectRoot;

require(projectRoot+ '/models/Freelance');
require(projectRoot + '/models/Review');

describe('Freelance Construction and creation\n', function(done){

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
    var freelance;

    before(function(done){
      //connect and drop db
      utils.connectAndDropDb(function(err){
        if (err) return done(err);

        freelance = new Freelance({
          name : 'Mark Knopfler',
          email : 'ripperoni@pepe.pe'
        });
        
        freelance.save(function(err,save){
          if (err) return done(err);
        });
      });
    });
  });
});


