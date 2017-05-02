/** @module models/Availability
* The Availability Model
* Schema:
* days        		Array      array of Days of availability
* recurrence      String      recurrence of the aforementioned array
*
* _id (ObjectID) will be added automatically by mongoose if not specified
*/

'use strict';
const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;

const Day = require('./Day');

const Availability = exports.Availability = new mongoose.Schema({
    days   			: [ { type: Day, default: [] } ],
    recurrence	: { type: String, enum:{ "none", "weekly", "monthly" } },
  },
  {
    versionKey: false,
  }
);

Availability.pre('save', function(next) {
  next();
});


//register model for schema
mongoose.model('Availability', Availability);
