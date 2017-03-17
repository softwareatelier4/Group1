/** @module models/Category
* The Category Model
* Schema:
* categoryName        String     Name of the Category. Required.
* freelancers         Array      Freelancers listed under this category.
*
* _id (ObjectID) will be added automatically by mongoose if not specified
*/

'use strict';
const mongoose = require('mongoose');
const ObjectID = mongoose.Schema.Types.ObjectId;
require ('./Freelance');

const Category = exports.Category = new mongoose.Schema({
    categoryName     : { type: String, required: true },
    freelancers      : [{ type: ObjectID, ref: 'Freelance', default:[] }],
  },
  {
    versionKey: false,
  }
);

Category.pre('save', function(next) {
  next();
});


//register model for schema
mongoose.model('Category', Category);
