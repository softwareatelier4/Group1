/* Utilities for the models tests */
/* Taken from "wa-exercise-5-2016-2017" by "Vincenzo Ferme, Andrea Gallidabino, Vasileios Triglianos" */

var config = require('../config')
var should = require('should');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

/** 
* Connects to mongo and drops the database.
*/
module.exports.connectAndDropDb = function connectAndDropDb(done){
  //check if connection has opened but is not ready yet
  if (mongoose.connection && mongoose.connection.readyState ==2){
    mongoose.createConnection(config.mongoUrl + config.mongoDbName, function(err){
      if(err) return done(err);
      dropDb(done);
    });
  }else{
    mongoose.connect(config.mongoUrl + config.mongoDbName, function(err){
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