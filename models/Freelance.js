/** @module models/Freelance
* The Freelance Model
* Schema:
* name						String			Name of the Freelance. Required.     //maybe also name company
* address					String			Address of the Freelance
* email						String			Email of the freelance. Required
* phone						String			Phone of the freelance
* avgScore					Integer			Average score of all reviews
* priceRange				String			Price range of the freelance e.g. 12-24.-/h
* reviews					[ObjectID]		Array containing IDs of all reviews
* tags						Array			Array of Strings. Tags used for search
*
* _id (ObjectID) will be added automatically by mongoose if not specified
*/

'use strict';
const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
require('./Review');

const Freelance = exports.Freelance = new mongoose.Schema({
		name : { type: String, required: true },
		address : { type: String },
		email : { type: String, required: true },
		phone : { type: String },
		avgScore : { type: Number },
		reviews : [{ type: ObjectID, ref: "Review", default: [] }],
		tags : [{ type: String, default: [] }],
});


Freelance.pre('save', function (next) {
	if (this.avgScore > 5) {
		this.avgScore = 5;
	} else if (this.avgScore < 0) {
		this.avgScore = 0;
		//maybe a problem with default -1 value of review, to check later.
	}
	next();
});

//register model for schema
mongoose.model('Freelance', Freelance);
