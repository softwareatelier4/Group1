'use strict';

const config = require('../config');

module.exports = {

  // Create JSON error message in case mongoose fails.
  formatErrorMessage : function(err) {
    let reason = err.message;
    let errorKeys = Object.keys(err.errors);
    let errorJSON = { "reason" : reason };
    let errors = [];
    for (let error of errorKeys) {
      errors.push(err.errors[error].message);
    }
    errorJSON.errors = errors;
    return errorJSON;
  },

  // Add self link to returned object
  addLinks : function(object, type) {
    object.links = [{
      "rel" : "self",
      "href" : config.url + "/" + type + "/" + object._id
    }];
  },

}
