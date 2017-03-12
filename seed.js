/** 
* Standalond db seed
*/
var seed = require('./seed_data/seedDb').seed;

seed(function(err, seedData){
  if (err) console.log(err);
  else console.log("Seeding db complete!")
  process.exit();
})