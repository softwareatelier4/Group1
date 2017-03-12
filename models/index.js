/** @module models/index.js
* Loads all models
*/
'use strict';

var mongoose = require('mongoose');

require('./Freelance');
require('./Review');

module.exports = {
	'Freelance'  : mongoose.model('Freelance'),
	'Review'     : mongoose.model('Review')
}
