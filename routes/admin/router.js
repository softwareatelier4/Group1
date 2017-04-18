/** @module admin/router */
'use strict';

const express = require('express');
const GoogleMaps = require('@google/maps');
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
  if (req.accepts('text/html')) {
    res.render('admin', {
      title: "JobAdvisor",
    });
  }
  else {
    res.sendStatus(404);
  }
});

/** router for root */
module.exports = router;
