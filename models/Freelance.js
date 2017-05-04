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
* state						enum			represent if the user has been claimed or not
* owner						ObjectID	User that owns the profile
*
* _id (ObjectID) will be added automatically by mongoose if not specified
*/

'use strict';
const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
require('./Review');
require('./Tag');
require('./Category');
require('./User');
const Review = mongoose.model('Review');

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
		owner					: { type: ObjectID, ref: "User" },
		//we recompute this on every review
		avgScore 			: { type: Number, default: 0 },
		reviews				: [{ type: ObjectID, ref: "Review", default: [] }],
		tags					: [{ type: ObjectID, ref: "Tag", default: [] }],
		availability	: [{type:Object, default:[] }],
		//TODO add certifications
	},
	{
		versionKey	: false,
	}
);


Freelance.pre('save', function (next) {

	//review between 0 and 5
	if (this.avgScore !== undefined) {
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
//call of asynchronous, parallel pre
// method 'validate' is not executed until done() is called.
// validate is also called for every update, not only save.
Freelance.pre('validate', true, function(next, done){
	var count = 0;
	next();
	this.avgScore = 0;
	if (this.reviews.length == 0) done();
	for (var item of this.reviews){
		Review.findById(item).exec((err, review) => {
			if (err) throw err;
			if (review){
				this.avgScore += review.score;
				count++;
			}
			if (count >= this.reviews.length) {
				this.avgScore = Math.round((this.avgScore / this.reviews.length) * 100) / 100;
				done();
			}
		});
	}
});


//register model for schema
mongoose.model('Freelance', Freelance);
