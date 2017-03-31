/** @module search/router */
'use strict';

const express = require('express');
const router = express.Router();
const middleware =  require('../middleware');
const rootUrl = require("../../config").url;
const utils = require('../utils');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Freelance = mongoose.model('Freelance');

// Supported methods
router.all('/', middleware.supportedMethods('GET, OPTIONS'));

// Return index
router.get('/', function(req, res, next) {
  const keyword = req.query.keyword;
  const regex = new RegExp(keyword, "i");
  let query = [
    { firstName : regex },
    { familyName : regex },
    { title : regex },
    { description : regex },
    { address : regex },
    { email : regex },
    { phone : regex },
    { price : regex },
  ];

  utils.searchInTags(regex, function(ids) {
    ids.forEach(function(id) {
      query.push({ _id : id});
    });

    Freelance.find({ $or : query }).populate('category').exec(function(err, results) {
      if (err) {
        res.status(400).json(err);
      } else {
        results.forEach(function(freelance) {
          utils.addLinks(freelance, "freelance");
        });
        res.json(results).end();
      }
    });
  });

});



/** router for search */
module.exports = router;
