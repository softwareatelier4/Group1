/** @module models/Review
* The Review Model
* Schema:
* author						String			Author of the review. Required.                 //maybe create User model?
* text							String			Text of the review.
* score							Integer			Score of the review, goes from 1-5. Required.
* target						ObjectID		Freelancer affected by review.
*
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
		score 	: { type: Integer },
		target 	: { type: ObjectID, ref: "Freelance", required: true }
});


Review.pre('save', function (next) {
	if (score > 5){
		score=5;
	} else if (score<0) {
		score=0;
	}
	next();
});


//register model for schema
mongoose.model('Review', Review);
