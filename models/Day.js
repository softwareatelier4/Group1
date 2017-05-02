/** @module models/Day
* The Day Model
* Schema:
* day        			 String      String containing the day of the week
* startTime        Date        start of the interval of time
* endTime        	 Date        start of the interval of time
*
* _id (ObjectID) will be added automatically by mongoose if not specified
*/

'use strict';
const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;


const Day = exports.Day = new mongoose.Schema({
    day    : { type: String, enum: [ 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday' ] },
    startTime    : { type: Date, required: true },
    endTime			: { type: Date, required: true },
  },
  {
    versionKey: false,
  }
);

Day.pre('save', function(next) {
	if(this.startTime !== null && this.endTime !== null){
		if (this.startTime > this.endTime){
			let temp = endTime;
			this.endTime = startTime;
			this.startTime = temp;
		}
	}
  next();
});


//register model for schema
mongoose.model('Day', Day);
