'use strict';

var mongoose = require('mongoose');
var JobListing = mongoose.model('JobListing');
var Review = mongoose.model('Review');
var ObjectId = mongoose.Types.ObjectId;

var jobListings = {
  name : 'JobListing', // this is the name of the model in mongoose
  data : [
    	{
           // "_id"          : "5837133bcb98f316ac47384e",
           // "name"		  : "Warrior",
           // "layer"		  : "objectsLayer",
           // "visibility"	  : {GM: false, Smaug: true, MrSatan :true, Ilija: true, bunny :true, DeadlyBurrito: true, FLCL: true},
           // "position"	  : {left: '50px', top: '50px'},
           // "hp"			  : 100,
           // "owner"		  : "5837133bcb98f316ac473855",
           // "control"	  : ["5837133bcb98f316ac473855"]

		}
  ]
}


var reviews = {
	name : 'Review', // this is the name of the model in mongoose
	data : [

	]
}



var seedData = [];
seedData.push(jobListings);
seedData.push(reviews);

module.exports = seedData;
