/** @module models/Duplicate
* The Duplicate Model
* Schema:
* userID						ObjectID			User signaling the duplicate. Required.
* originalID				ObjectID			Freelance subject of the claim. Required.
* duplicateID				ObjectID			Freelance object of the claim. Required.
*
* _id (ObjectID) will be added automatically by mongoose if not specified
*/

'use strict';
const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
require ('./Freelance');
require ('./User');

const Duplicate = exports.Duplicate = new mongoose.Schema({
		userID 					: { type: ObjectID, ref: "User", required: true },
		originalID 			: { type: ObjectID, ref: "Freelance", required: true  },
		duplicateID 		: { type: ObjectID, ref: "Freelance", required: true  },
	},
	{
		versionKey: false,
	}
);

Duplicate.pre('save', function(next) {
	next();
});


//register model for schema
mongoose.model('Duplicate', Duplicate);
