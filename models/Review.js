/** @module models/Review
* The Review Model
* Schema:
* author						String			Author of the review. Required.                 //maybe create User model?
* text							String			Text of the review.
* score							Integer			Score of the review, goes from 1-5. Required.
* target						ObjectID		Freelancer affected by review.
* date							Date			date of the review, default now.
*
* _id (ObjectID) will be added automatically by mongoose if not specified
*/

'use strict';
const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
require ('./Freelance');

const Review = exports.Review = new mongoose.Schema({
		author 	: { type: String, required: true },
		text 	: { type: String, default: "No text." },
		score 	: { type: Number },
		date	: { type: Date, default: Date.now },
	},
	{
		versionKey: false,
	}
);

Review.pre('save', function (next) {
	if (this.score > 5){
		this.score = 5;
	} else if (this.score < 0) {
		this.score = 0;
	}
	next();
});


//register model for schema
mongoose.model('Review', Review);
