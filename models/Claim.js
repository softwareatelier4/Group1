/** @module models/Review
* The Claim Model
* Schema:
* userID						ObjectID			User opening the claim. Required.
* freelanceID				ObjectID			Freelance target of the claim. Required.
* dateOpened				Date					Date the claim was made. Default: Date.now()
*
* _id (ObjectID) will be added automatically by mongoose if not specified
*/

'use strict';
const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
require ('./Freelance');
require ('./User');

const Claim = exports.Claim = new mongoose.Schema({
		userID 				: { type: ObjectID, ref: "User", required: true },
		freelanceID 	: { type: ObjectID, ref: "Freelance", required: true  },
		dateOpened 		: { type: Date, default: Date.now() },
	},
	{
		versionKey: false,
	}
);

Claim.pre('save', function(next) {
	next();
});


//register model for schema
mongoose.model('Claim', Claim);
