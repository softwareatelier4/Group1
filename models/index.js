/** @module models/index.js
* Loads all models
*/
'use strict';

var mongoose = require('mongoose');

require('./Freelance');
require('./Review');
require('./Tag');
require('./Category');

module.exports = {
	'Freelance'  : mongoose.model('Freelance'),
	'Review'     : mongoose.model('Review'),
  'Tag'        : mongoose.model('Tag'),
  'Category'   : mongoose.model('Category')
}
