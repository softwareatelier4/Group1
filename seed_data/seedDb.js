'use strict';

var config = require('../config');
var utils = require('./utils')

//load model
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var models = require('../models');

//total callbacks (one for each model)
var totalCbs = 1;
var cbCnt = 0;

//seedData
var seedData = require('./seedData')

/**
* Recursive function that goes through 
* seedData populating each item of it
*/
var seedModel = function(idx, done){
  if(idx == seedData.length){
    return done(null, seedData);
  }

  var modelName = seedData[idx].name;
  models[modelName].create(seedData[idx].data, function(err){
    if (err) done (err);

    //seed next model
    console.log(modelName + " OK");
    seedModel(++idx, done)
  });
}

/**
* This is where everything starts
*/
module.exports.seed = function (done){
  utils.connectAndDropDb(function(err){
    if(err) return done(err);
    seedModel(0, done);
  });
}
