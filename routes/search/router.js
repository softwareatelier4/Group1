/** @module search/router */
'use strict';

var express = require('express');
var router = express.Router();
var middleware =  require('../middleware');
var rootUrl = require("../../config").url;


//supported methods
router.all('/', middleware.supportedMethods('GET, OPTIONS'));

//return index
router.get('/', function(req, res, next) {
  res.sendStatus(200);
});

/** router for root */
module.exports = router;
