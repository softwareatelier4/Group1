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

const adminUsername = 'admin';
const adminPassword = 'asd';

// Supported methods
router.all('/', middleware.supportedMethods('GET, OPTIONS'));

router.get('/login', function(req, res) {
  if (adminUsername === req.query.username && adminPassword === req.query.password) {
    res.status(200).json({ valid : true });
  } else {
    res.sendStatus(400);
  }
});

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
