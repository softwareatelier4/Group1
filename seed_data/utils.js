/** @module test/model/utils
* Utilities for the model tests
*/

var config = require('../config')
var should = require('should');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

/** 
* Drops the database and closes the mongoose connection.
*/
module.exports.dropDbAndCloseConnection = function dropDbAndCloseConnection(done){
  //drop database
  mongoose.connection.db.dropDatabase( function(err){
    if(err) return done(err);

    //close connection
    mongoose.connection.close( function(err){
      if(err) return done(err);
      done();
    });
  });
}

/** 
* Drops the database
*/
var dropDb = module.exports.dropDb = function dropDb(done){
  //drop database
  mongoose.connection.db.dropDatabase( function(err){
    if(err) return done(err);
    done();
  });
}

/** 
* Checks if an error is thrown when a model's property is null undefined or empty
*/
module.exports.errorIfNullUndefinedOrEmpty = function errorIfNullUndefinedOrEmpty(obj, prop, done){
  //check undefined
  obj[prop] = undefined;
  obj.save(function(err, saved){
   checkValidationErrorFields(err, prop);
    
    //check null
    obj[prop] = null;
    obj.save(function(err, saved){
      checkValidationErrorFields(err, prop);
      
      //check empty
      obj[prop] = '';
      obj.save(function(err, saved){
        checkValidationErrorFields(err, prop);

        done();
      });
    });
  });
}

/** 
* Goes through a Mongoose ValidationError error to check specific properties
*/
var checkValidationErrorFields = module.exports.checkValidationErrorFields = function checkValidationErrorFields(err, prop){
  should.exist(err, 'There should be an error');
  err.name.should.equal('ValidationError');
  var propError = err.errors[prop];
  should.exist(propError, 'err.errors.' + prop + ' should exist');
  propError.name.should.equal('ValidatorError');
  propError.message.should.equal('Path `' + prop + '` is required.');
}


/** 
* Checks if an error is thrown when a model's property is null or undefined
*/
module.exports.errorIfNullOrUndefined = function errorIfNullOrUndefined(obj, prop, done){
  //check undefined
  obj[prop] = undefined;
  obj.save(function(err, saved){
   checkValidationErrorFields(err, prop)
    
    //check null
    obj[prop] = null;
    obj.save(function(err, saved){
      checkValidationErrorFields(err, prop);
      
      done();
    });
  });
}

/**
* Goes through a Mongoose CastError error to check specific properties
*/
var checkCastErrorFields = module.exports.checkCastErrorFields = function checkCastErrorFields(err, prop, kind){
  var kind = kind || "ObjectID";
  should.exist(err, 'There should be an error');
  should.exist(err.errors[prop], 'There should be an err.errors[' + prop + ']');

  var err2Check =  err.errors[prop];
  err2Check.name.should.equal('CastError');
  err2Check.kind.should.equal(kind);
  err2Check.path.should.equal(prop);
}

/** 
* Connects to mongo and drops the database.
*/
module.exports.connectAndDropDb = function connectAndDropDb(done){
  //check if connection has opened but is not ready yet
  if (mongoose.connection && mongoose.connection.readyState ==2){
    console.log('#######' + config.mongoUrl+config.mongoDbName);
    mongoose.createConnection(config.mongoUrl+config.mongoDbName, function(err){
      if(err) return done(err);
      dropDb(done);
    });
  }else{
    mongoose.connect(config.mongoUrl+config.mongoDbName, function(err){
      if (err) {
        //if connection is already open it's fine
        if(err.message !== 'Trying to open unclosed connection.'){
          return done(err);
        }
      }
      dropDb(done);
    });
  } 
}
