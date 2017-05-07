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

    Freelance.find({ $or : query }).populate('category').lean().exec(function(err, freelancers) {
      if (err) {
        res.status(400).json(err);
      } else {
        let destinations = [];
        let destinationsEmergency = [];
        freelancers.forEach(function(freelance) {
          utils.addLinks(freelance, "freelance");
          destinations.push(freelance.address);
          freelance.distance = Number.MAX_SAFE_INTEGER;
          freelance.duration = Number.MAX_SAFE_INTEGER;
          // console.log(freelance.availability);
          let day = req.query.date ? freelancerAvailableDay(freelance, req.query.date) : null;
          if (day) {
            freelance.emergency = {
              available: true,
              end: day.end,
              location: day.location
            };
            console.log(day.location);
            destinationsEmergency.push(day.location);
          } else {
            freelance.emergency = {
              available: false
            }
            // console.log('NO LOCATION');
            destinationsEmergency.push('xjhasbdjahwbelaebhajwhbljfbhajw'); // Impossible location
          }
        });

			  if (!req.query.origin) {
          res.json(freelancers).end();
          return;
			  }

        // Google distance request
        let googleMapsClient = GoogleMaps.createClient({
          // any works, it might stop working for some time after too many requests,
          // in case switch to another
          // key: 'AIzaSyAn3U0Cm_JnVhLw0vd30NtqVE6P7b5I1h4'
          // key: 'AIzaSyDsLQ0CuDFEGnjaoQuKxKWfi4iDn1n8WhU'
          // key: 'AIzaSyC-6I8PVbi_JXuQqqZSDb4SvHYFC6oOZXM'
          // key: 'AIzaSyAalQlIJ6_Ed2bgK2_FfTtnuoepawVmbsw'
          // key: 'AIzaSyAkznhvPSGSqBjGDlh0wJxSSXShH9HTvww'
          // key: 'AIzaSyAgIwltHqleBdvUyROF_tEdCLl2HCD_ZrM'
          // key: 'AIzaSyCtFrJx4YIiNzA362xJGat0guqBLQ6Ie0w'
          key: 'AIzaSyCubmhdnWsJ-AQHOJkzOYF4FpNLxtHwsvM'
        });
        googleMapsClient.distanceMatrix({
          origins: [ req.query.origin ],
          destinations: destinations
        }, function(err, response) {
          if (!err) {
            let distances = response.json.rows[0].elements;
            distances.forEach(function(el, i) {
              if (el.distance) {
                freelancers[i].distance = el.distance.value;
                freelancers[i].duration = el.duration.value;
              } else {
                freelancers[i].distance = Number.MAX_SAFE_INTEGER;
                freelancers[i].duration = Number.MAX_SAFE_INTEGER;
              }
            });
            googleMapsClient.distanceMatrix({
              origins: [ req.query.origin ],
              destinations: destinationsEmergency
            }, function(err, response) {
              let distancesEmergency = response.json.rows[0].elements;
              distancesEmergency.forEach(function(r, i) {
                if (r.distance) {
                  freelancers[i].emergency.distance = r.distance.value;
                  freelancers[i].emergency.duration = r.duration.value;
                } else {
                  freelancers[i].emergency.distance = Number.MAX_SAFE_INTEGER;
                  freelancers[i].emergency.duration = Number.MAX_SAFE_INTEGER;
                }
              });
              res.json(freelancers).end();
            });
          }
        });
      }
    });
  });
});

// Check if a freelancer is available in a given moment
function freelancerAvailableDay(freelancer, dateStr) {
  let date = new Date(dateStr);
  for (let day of freelancer.availability) {
    let begin = new Date(day.begin);
    let end = new Date(day.end);
    if (date.getTime() < begin.getTime()) {
      return null;
    } else if (date.getTime() <= end.getTime()) {
      return day;
    }
  }
  return null;
}

/** router for search */
module.exports = router;
