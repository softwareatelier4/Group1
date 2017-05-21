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
var users = require('./usersData');
var usersSize = users.data.length;
var claims = require('./claimsData');
var claimsSize = claims.data.length;
var availabilities = require('./availabilityData');
var availabilitySize = availabilities.data.length;
var duplicates = require('./duplicatesData');
var duplicatesSize = duplicates.data.length;

//set the category
for (var i = freelancers.data.length - 1; i >= 0; i--) {
  var n = Math.floor(Math.random() * catSize);
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
// hardcode the location for freelancer
var locations = ["Acquarossa", "Agno", "Alto Malcantone", "Airolo", "Aranno", "Arbedo-Castione", "Arogno", "Ascona", "Astano", "Avegno-Gordevio", "Balerna", "Bedano", "Bedigliora", "Bedretto", "Bellinzona", "Biasca", "Bioggio", "Bissone", "Blenio", "Bodio", "Bosco/Gurin", "Breggia", "Brione (Verzasca)", "Brione sopra Minusio", "Brissago", "Brusino Arsizio", "Cademario", "Cadempino", "Cadenazzo", "Camorino", "Campo (Vallemaggia)", "Canobbio", "Capriasca", "Caslano", "Castel San Pietro", "Centovalli", "Cerentino", "Cevio", "Chiasso", "Claro", "Coldrerio", "Collina d'Oro", "Comano", "Corippo", "Cresciano", "Croglio", "Cugnasco-Gerra", "Cureglia", "Curio", "Dalpe", "Faido", "Frasco", "Gambarogno", "Giornico", "Giubiasco", "Gnosca", "Gordola", "Gorduno", "Grancia", "Gravesano", "Gresso", "Gudo", "Iragna", "Isone", "Isorno", "Lamone", "Lavertezzo", "Lavizzara", "Linescio", "Locarno", "Lodrino", "Losone", "Lugano", "Lumino", "Maggia", "Magliaso", "Manno", "Maroggia", "Massagno", "Melano", "Melide", "Mendrisio", "Mergoscia", "Mezzovico-Vira", "Miglieglia", "Minusio", "Moleno", "Monte Carasso", "Monteceneri", "Monteggio", "Morbio Inferiore", "Morcote", "Mosogno", "Muralto", "Muzzano", "Neggio", "Novaggio", "Novazzano", "Onsernone", "Origlio", "Orselina", "Osogna", "Paradiso", "Personico", "Pianezzo", "Pollegio", "Ponte Capriasca", "Ponte Tresa", "Porza", "Prato (Leventina)", "Preonzo", "Pura", "Quinto", "Riva San Vitale", "Ronco sopra Ascona", "Rovio", "Sant'Antonino", "Sant'Antonio", "Savosa", "Sementina", "Serravalle", "Sessa", "Sobrio", "Sonogno", "Sorengo", "Stabio", "Tenero-Contra", "Terre di Pedemonte", "Torricella-Taverne", "Vacallo", "Vergeletto", "Vernate", "Vezia", "Vico Morcote", "Vogorno"];
for (var i = freelancers.data.length - 1; i >= 0; i--) {
  var rndl = Math.floor(Math.random() * locations.length);
  freelancers.data[i].address = locations[rndl];
}


// The first 'staticUsers' users are static and can be used for tests
const staticUsers = 6;

const emergencyUserIndex = staticUsers - 1;
users.data[emergencyUserIndex].freelancer.push([freelancers.data[emergencyUserIndex]._id]);
freelancers.data[emergencyUserIndex].owner = users.data[emergencyUserIndex]._id;
freelancers.data[emergencyUserIndex].status = 'verified';
// bind non-static users to Freelance profiles
for (var i = staticUsers, k = 0; i < usersSize; i++) {
  // var rndf = Math.floor(Math.random() * freelancersSize);
  users.data[i].freelancer = [freelancers.data[i]._id];
  freelancers.data[i].owner = users.data[i]._id;
  freelancers.data[i].state = 'verified';
  // give non-static users an availability schedule
  for (var j = 0; j < 10; j++, k++) {
    freelancers.data[i].availability.push({
      day: new Date(availabilities.data[k].day),
      begin: new Date(availabilities.data[k].begin),
      end: new Date(availabilities.data[k].end),
      location: availabilities.data[k].location
    });
  }
}

// utility function to dump the whole seed data array of a model
function dump(data){
  for (var i = data.length - 1; i >= 0; i--) {
    console.log(data[i]);
  }
}

/* Keep this order for seeding
* as it depends on references
*/
var seedData = [];
seedData.push(reviews);     // 0
seedData.push(freelancers); // 1
seedData.push(tags);        // 2
seedData.push(categories);  // 3
seedData.push(users);       // 4
seedData.push(claims);      // 5
seedData.push(duplicates);  // 6

module.exports = seedData;
