/**
* Standalond db seed
*/
var seed = require('./seed_data/seedDb').seed;
var fs = require('fs');

// rm -rf dirPath
rmDir = function(dirPath) {
  try { var files = fs.readdirSync(dirPath); }
  catch(e) { return; }
  if (files.length > 0)
    for (var i = 0; i < files.length; i++) {
      var filePath = dirPath + '/' + files[i];
      if (fs.statSync(filePath).isFile())
        fs.unlinkSync(filePath);
      else
        rmDir(filePath);
    }
  fs.rmdirSync(dirPath);
};

seed(function(err, seedData){
  rmDir('./public/claims/');
  fs.mkdirSync('./public/claims/');
  if (err) console.log(err);
  else console.log("Seeding db complete!");
  process.exit();
})
