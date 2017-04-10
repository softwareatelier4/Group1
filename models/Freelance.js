/** @module models/Freelance
* The Freelance Model
* Schema:
* firstName				String			Name of the Freelance. Required.     //maybe also name company
* familyName			String 			Family name of the freelancer
* title						String 			Title that appears in the search result of freelancer. Required.
* category 				ObjectID 		One of the possible categories for search
* description			String 			description of the freelancer
* urlPicture			String 			Url of page picture
* address					String			Address of the Freelance
* email						String			Email of the freelance. Required
* phone						String			Phone of the freelance
* avgScore				Integer			Average score of all reviews
* price						Object			Price range of the freelance e.g. {min: 12, max: 24}
* reviews					[ObjectID]		Array containing IDs of all reviews
* tags						Array			Array of Strings. Tags used for search
*
* _id (ObjectID) will be added automatically by mongoose if not specified
*/

'use strict';
const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
require('./Review');
require('./Tag');
require('./Category');

const Freelance = exports.Freelance = new mongoose.Schema({
		firstName			: { type: String, required: true },
		familyName		: { type: String },
		title					: { type: String, required: true },
		category			: { type: ObjectID, ref: "Category" },
		description		: { type: String },
		urlPicture		: { type: String },
		address				: { type: String },
		email					: { type: String, required: true },
		phone					: { type: String },
		price					: { type: Object },
		state					: { type: String, enum: ['verified', 'in progress', 'not verified'], default: 'not verified' },
		//we recompute this on every review
		avgScore 			: { type: Number },
		reviews				: [{ type: ObjectID, ref: "Review", default: [] }],
		tags					: [{ type: ObjectID, ref: "Tag", default: [] }],
		//TODO add certifications
	},
	{
		versionKey	: false,
	}
);


Freelance.pre('save', function (next) {

	//review between 0 and 5
	if (this.avgScore !== undefined){
		if (this.avgScore > 5) {
			this.avgScore = 5;
		} else if (this.avgScore < 0) {
			this.avgScore = 0;
		}
	}
	//we check that price has both a min and a max
	//and that they are both above 0; in particular, max must be > min
	//maybe in future
	if (this.price !== undefined) {
		if ((this.price.hasOwnProperty('min') && this.price.hasOwnProperty('max'))) {
			if (this.price.min < 0) {
				this.price.min = 0;
			} else if (this.price.max < 0 || this.price.max < this.price.min) {
				this.price.max = this.price.min;
			}
		} else {
			this.price = {min:0, max:0};
		}
	}


	next();

});
// TODO Post to update value of avgscore with reviews

//register model for schema
mongoose.model('Freelance', Freelance);
