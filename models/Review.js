/** @module models/Review
* The Review Model
* Schema:
* author						String			Author of the review. Required.                 //maybe create User model?
* text							String			Text of the review.
* score							Integer			Score of the review, goes from 1-5. Required.
* target						ObjectID		Freelancer affected by review.
* date							Date			date of the review, default now.
* reply             String    reply from the author
*
* _id (ObjectID) will be added automatically by mongoose if not specified
*/

'use strict';
const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
require ('./Freelance');

const Review = exports.Review = new mongoose.Schema({
		//in future maybe add User and author is ObjectID ref User
		author 	: { type: String, required: true },
		title 	: { type: String },
		text 	: { type: String },
		score 	: { type: Number, required: true },
		date	: { type: Date, default: Date.now },
		reply 	: { type: ObjectID, ref: 'Review' },
	},
	{
		versionKey: false,
	}
);

Review.pre('save', function(next) {
	if (this.score > 5){
		this.score = 5;
	} else if (this.score < 0) {
		this.score = 0;
	}

	if (this.text !== undefined) {
		let length = this.text.length;

		if (length > 1000) {
			this.text = this.text.substring(0, 999);
		}
	}

	if (this.reply !== undefined) {

		let length = this.reply.text.length;

		if (length > 1000) {
			this.reply = this.reply.text.substring(0, 999);
		}
	}

	next();
});


//register model for schema
mongoose.model('Review', Review);
