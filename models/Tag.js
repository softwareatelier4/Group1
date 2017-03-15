/** @module models/Tag
* _id (ObjectID) will be added automatically by mongoose if not specified
*/

'use strict';
const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
require ('./Freelance');

const Tag = exports.Tag = new mongoose.Schema({
	//in future maybe add User and author is ObjectID ref User
		tagName 		: { type: String, required: true },
		freelancers 	: [{ type: ObjectID, ref: 'Freelance', default:[] }],
	},
	{
		versionKey: false,
	}
);

Tag.pre('save', function (next) {

	next();
});


//register model for schema
mongoose.model('Tag', Tag);
