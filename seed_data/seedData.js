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
var locations = ["Acquarossa", "Agno", "Alto Malcantone", "Airolo", "Aranno", "Arbedo-Castione", "Arogno", "Ascona", "Astano", "Avegno-Gordevio", "Balerna", "Bedano", "Bedigliora", "Bedretto", "Bellinzona", "Biasca", "Bioggio", "Bissone", "Blenio", "Bodio", "Bosco/Gurin", "Breggia", "Brione (Verzasca)", "Brione sopra Minusio", "Brissago", "Brusino Arsizio", "Cademario", "Cadempino", "Cadenazzo", "Camorino", "Campo (Vallemaggia)", "Canobbio", "Capriasca", "Caslano", "Castel San Pietro", "Centovalli", "Cerentino", "Cevio", "Chiasso", "Claro", "Coldrerio", "Collina d'Oro", "Comano", "Corippo", "Cresciano", "Croglio", "Cugnasco-Gerra", "Cureglia", "Curio", "Dalpe", "Faido", "Frasco", "Gambarogno", "Giornico", "Giubiasco", "Gnosca", "Gordola", "Gorduno", "Grancia", "Gravesano", "Gresso", "Gudo", "Iragna", "Isone", "Isorno", "Lamone", "Lavertezzo", "Lavizzara", "Linescio", "Locarno", "Lodrino", "Losone", "Lugano", "Lumino", "Maggia", "Magliaso", "Manno", "Maroggia", "Massagno", "Melano", "Melide", "Mendrisio", "Mergoscia", "Mezzovico-Vira", "Miglieglia", "Minusio", "Moleno", "Monte Carasso", "Monteceneri", "Monteggio", "Morbio Inferiore", "Morcote", "Mosogno", "Muralto", "Muzzano", "Neggio", "Novaggio", "Novazzano", "Onsernone", "Origlio", "Orselina", "Osogna", "Paradiso", "Personico", "Pianezzo", "Pollegio", "Ponte Capriasca", "Ponte Tresa", "Porza", "Prato (Leventina)", "Preonzo", "Pura", "Quinto", "Riva San Vitale", "Ronco sopra Ascona", "Rovio", "Sant'Antonino", "Sant'Antonio", "Savosa", "Sementina", "Serravalle", "Sessa", "Sobrio", "Sonogno", "Sorengo", "Stabio", "Tenero-Contra", "Terre di Pedemonte", "Torricella-Taverne", "Vacallo", "Vergeletto", "Vernate", "Vezia", "Vico Morcote", "Vogorno"];
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

/* Keep this order for seeding 
* as it depends on references
*/
var seedData = [];
seedData.push(freelancers);
seedData.push(reviews);
seedData.push(tags);
seedData.push(categories);

module.exports = seedData;
