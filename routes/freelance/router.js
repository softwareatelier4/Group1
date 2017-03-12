/** @module freelance/router */
'use strict';

var express = require('express');
var router = express.Router();
var middleware =  require('../middleware');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Freelance = mongoose.model('Freelance');
var rootUrl = require("../../config").url;

//fields we don't want to show to the client
var fieldsFilter = { '__v': 0 };

//supported methods
router.all('/:freelanceid', middleware.supportedMethods('GET, PUT, OPTIONS')); //add delete later
router.all('/', middleware.supportedMethods('GET, OPTIONS'));

//get freelance
router.get('/:freelanceid', function(req, res, next) {
  Freelance.findById(req.params.freelanceid, fieldsFilter).lean().exec(function(err, freelance){
    if (err) {
      res.status(500).end();
    }
    else if (!freelance) {
      res.status(404)
      .json({
        statusCode: 404,
        message: "Not Found",
      })
      .end();
    }
    else {
      addLinks(freelance);
      res.json(freelance).end();
    }
  });
});

//add self link to returned freelance
function addLinks(freelance){
  freelance.links = [
    {
      "rel" : "self",
      "href" : rootUrl + "/freelance/" + freelance._id
    }
  ];
}

module.exports = router;
