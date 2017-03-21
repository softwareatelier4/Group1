'use strict';

var mongoose = require('mongoose');
var JobListing = mongoose.model('Freelance');
var Review = mongoose.model('Review');
var ObjectId = mongoose.Types.ObjectId;


/* NEW SEED */
var freelancers = require('./freelancesData');
var freelancersSize = freelancers.data.length;
var reviews = require('./reviewsData');
var reviewsSize = reviews.data.length;
var tags = require('./tagsData');
var tagsSize = tags.data.length;
var categories = require('./categoriesData');
var catSize = categories.data.length;

//set the category
for (var i = freelancers.data.length - 1; i >= 0; i--) {
  var n = Math.floor(Math.random() * catSize);
  // console.log(categories.data[n]['_id']);
  var rndId = categories.data[n]['_id'];
  freelancers.data[i]['category'] = rndId;
  categories.data[n].freelancers.push(freelancers.data[i]['_id']);
}
// bind reviews
for (var i = reviewsSize - 1; i >= 0; i--) {
  var id = reviews.data[i]['_id'];
  var n = Math.floor(Math.random() * freelancersSize);
  freelancers.data[n].reviews.push(id);
}
// bind tags
for (var i = freelancersSize - 1; i >= 0; i--) {
  var m = Math.floor(Math.random() * 5 + 1); // give each freelancrs 1-5 random tags
  for (var j = 0; j < m; j++) {
    var n = Math.floor(Math.random() * tagsSize);
    freelancers.data[i].tags.push(tags.data[n]['_id']);
    tags.data[n].freelancers.push(freelancers.data[i]['_id']);
  }
}
// hardcode the location
var locations = ["Lugano", "Bellinzona", "Mendrisio"];
for (var i = freelancers.data.length - 1; i >= 0; i--) {
  var rndl = Math.floor(Math.random() * locations.length);
  freelancers.data[i].address = locations[rndl];
}
// dump(freelancers.data);

function dump(data){
  for (var i = data.length - 1; i >= 0; i--) {
    console.log(data[i]);
  }
}

var seedData = [];
seedData.push(freelancers);
seedData.push(reviews);
seedData.push(tags);
seedData.push(categories);

module.exports = seedData;
