/** @module category/router */
'use strict';

var express = require('express');
var router = express.Router();
var middleware =  require('../middleware');
const utils = require('../utils');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
const Category = mongoose.model('Category');

// Supported methods.
router.all('/', middleware.supportedMethods('GET, OPTIONS'));

// GET /category/
router.get('/', function(req, res, next) {
    Category.find({}).lean().exec(function(err, categories) {
      if (err) {
        res.status(400).json(utils.formatErrorMessage(err));
      }
      else if (!categories) {
        res.status(404).json({
          statusCode: 404,
          message: "Not Found",
        });
      }
      else {
        categories.forEach(function(category){
          utils.addLinks(category, 'category');
        });
        res.status(200).json(categories);
      }
    });
});

module.exports = router;
