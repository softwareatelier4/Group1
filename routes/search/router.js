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
  const query = [
    { firstName : regex },
    { familyName : regex },
    { title : regex },
    { description : regex }
  ]
  Freelance.find({ $or : query }, function(err, results) {
    if (err) {
      res.status(400).json(err);
    } else if (!results) {
      res.status(404).json({
        statusCode: 404,
        message: "Not Found",
      });
    } else {
      results.forEach(function(freelance) {
        utils.addLinks(freelance, "freelance");
      });
      res.json(results).end();
    }
  });
});

/** router for search */
module.exports = router;
