/** @module models/User
* The User Model
* Schema:
* username        String      username Required
* password        String      password Required
* email						String		  email Required
* freelancer 			ObjectID 		freelancer profile linked to this user
*
* _id (ObjectID) will be added automatically by mongoose if not specified
*/

'use strict';
const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
require ('./Freelance');

const User = exports.User = new mongoose.Schema({
    username    : { type: String, required: true },
    password    : { type: String, required: true },
    email				: { type: String, required: true },
    freelancer	: { type: ObjectID, ref: 'Freelance'},
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
