/** @module models/User
* The User Model
* Schema:
* username        String      username Required
* password        String      password Required
* email						String		  email Required
* freelancer 			Array 			freelancer profiles linked to this user (ObjectIDs)
*
* _id (ObjectID) will be added automatically by mongoose if not specified
*/

'use strict';
const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
require ('./Freelance');

const User = exports.User = new mongoose.Schema({
    username    : { type: String, required: true, unique: true },
    password    : { type: String, required: true },
    email				: { type: String, required: true },
		claiming		: { type: Boolean, default: false},
    freelancer	: { type: Array, default: []},
  },
  {
    versionKey: false,
  }
);

User.pre('save', function(next) {
  next();
});


//register model for schema
mongoose.model('User', User);
