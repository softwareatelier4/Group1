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

function ajaxRequest(method, url, headers, data, callback) {
	let request = new XMLHttpRequest();
	request.open(method, url, true);
	request.onreadystatechange = function() {
		if (request.readyState === 4) {
			switch (request.status) {
				case 200:
				case 201:
					callback(JSON.parse(request.responseText));
					break;
				case 205:
					callback(request.responseText);
					break;
				default:
					console.log(request.status);
					callback(request.status);
			}
		}
	};

	request.setRequestHeader("Accept", "application/json");

	// add custom headers
	if (headers) {
    for (header in headers) {
			request.setRequestHeader(`${header}`, `${headers[header]}`);
		}
  }

	if (method === "POST" || method === "PUT") {
		request.setRequestHeader("Content-Type", "application/json");
	}

	// send body data
	request.send(JSON.stringify(data));
}

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
  Freelance.find({ $or : query }).populate('category').lean().exec(function(err, results) {
    if (err) {
      res.status(400).json(err);
    } else {
      let destinations = [];
      results.forEach(function(freelance) {
        utils.addLinks(freelance, "freelance");
        destinations.push(freelance.address);
      });

      // Google distance request
      let googleMapsClient = GoogleMaps.createClient({
        key: 'AIzaSyDsLQ0CuDFEGnjaoQuKxKWfi4iDn1n8WhU'
      });
      googleMapsClient.distanceMatrix({
        origins: [ 'Lugano, Switzerland' ],
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

/** router for search */
module.exports = router;
