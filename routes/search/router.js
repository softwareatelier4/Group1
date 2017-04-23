/** @module search/router */
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
  const keyword = req.query.keyword;
  var pattern = '';
  if (keyword) {
    for(let word of keyword.split(' ')) {
      console.log(word);
      pattern += word + '|';
    }
  }
  pattern = pattern.slice(0, -1) || keyword;
  const regex = new RegExp(pattern, "i");
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

    Freelance.find({ $or : query }).populate('category').lean().exec(function(err, results) {
      if (err) {
        res.status(400).json(err);
      } else {
        let destinations = [];
        results.forEach(function(freelance) {
          utils.addLinks(freelance, "freelance");
          destinations.push(freelance.address);
          freelance.distance = Number.MAX_SAFE_INTEGER;
          freelance.duration = Number.MAX_SAFE_INTEGER;
        });

			  if (!req.query.origin) {
          res.json(results).end();
          return;
			  }

        // Google distance request
        let googleMapsClient = GoogleMaps.createClient({
          // any works, it might stop working for some time after too many requests,
          // in case switch to another
          // key: 'AIzaSyDsLQ0CuDFEGnjaoQuKxKWfi4iDn1n8WhU'
          // key: 'AIzaSyC-6I8PVbi_JXuQqqZSDb4SvHYFC6oOZXM'
          // key: 'AIzaSyAalQlIJ6_Ed2bgK2_FfTtnuoepawVmbsw'
          key: 'AIzaSyAkznhvPSGSqBjGDlh0wJxSSXShH9HTvww'
        });
        googleMapsClient.distanceMatrix({
          origins: [ req.query.origin ],
          destinations: destinations
        }, function(err, response) {
          if (!err) {
            let distances = response.json.rows[0].elements;
            distances.forEach(function(el, i) {
              if (el.distance) {
                results[i].distance = el.distance.value;
                results[i].duration = el.duration.value;
              } else {
                results[i].distance = Number.MAX_SAFE_INTEGER;
                results[i].duration = Number.MAX_SAFE_INTEGER;
              }
            });
            res.json(results).end();
          }
        });
      }
    });
  });
});

/** router for search */
module.exports = router;
