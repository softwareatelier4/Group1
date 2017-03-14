/** @module models/Freelance
* The Freelance Model
* Schema:
* name						String			Name of the Freelance. Required.     //maybe also name company
* address					String			Address of the Freelance
* email						String			Email of the freelance. Required
* phone						String			Phone of the freelance
* avgScore					Integer			Average score of all reviews
* price						Object			Price range of the freelance e.g. {min: 12, max: 24}
* reviews					[ObjectID]		Array containing IDs of all reviews
* tags						Array			Array of Strings. Tags used for search
*
* _id (ObjectID) will be added automatically by mongoose if not specified
*/

'use strict';
const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
require ('./Review');

const Freelance = exports.Freelance = new mongoose.Schema({
		name			: { type: String, required: true },
		address			: { type: String },
		email			: { type: String, required: true },
		phone			: { type: String },
		price			: { type: Object },
		avgScore 		: { type: Number },
		reviews			: [{ type: ObjectID, ref: "Review", default: [] }],
		tags			: [{ type: String, default: [] }],
});


Freelance.pre('save', function (next) {

	//review between 0 and 5
	if (this.avgScore > 5){
		this.avgScore = 5;
	} else if (this.avgScore < 0) {
		this.avgScore = 0;
		//maybe a problem with default -1 value of review, to check later.
	}

	//we check that price has both a min and a max
	//and that they are both above 0; in particular, max must be > min
	if (!price.hasOwnProperty('min') && price.hasOwnProperty('max')){
		price = {min: 0, max: 0};
	}
	if((price.min<0)){
		price.min=0;
	} else if( price.max<0 || price.max < price.min){
		price.max=price.min;
	}

	next();

});

//register model for schema
mongoose.model('Freelance', Freelance);
