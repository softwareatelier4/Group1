/** @module root/router */
'use strict';

const express = require('express');
const router = express.Router();
const middleware =  require('../middleware');
const rootUrl = require("../../config").url;

// supported methods
router.all('/', middleware.supportedMethods('GET, OPTIONS'));

// list users
router.get('/', function(req, res, next) {
  if (req.accepts('text/html')) {
    res.render('index', {
      title: "JobAdvisor",
      logged: (req.session.user_id != undefined) // no session means not logged
    });
  }
  else {
    res.sendStatus(404);
  }
});

/** router for root */
module.exports = router;
