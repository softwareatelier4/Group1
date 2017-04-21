/** @module admin/router */
'use strict';

const express = require('express');
const router = express.Router();
const middleware =  require('../middleware');
const rootUrl = require("../../config").url;
const utils = require('../utils');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Category = mongoose.model('Category');
// const nodemailer = require('nodemailer');

const adminUsername = 'admin';
const adminPassword = 'asd';

// Supported methods
router.all('/', middleware.supportedMethods('GET, POST, DELETE, OPTIONS'));

router.get('/login', function(req, res) {
  if (adminUsername === req.query.username && adminPassword === req.query.password) {
    Category.find().lean().exec(function(err, categories) {
      if (err) {
        res.sendStatus(500);
      } else {
        res.status(200).json({ valid : true, categories : categories });
      }
    });
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

router.post('/category', function(req, res) {
  // TODO: add category
  if (adminUsername === req.body.username && adminPassword === req.body.password) {
    res.status(201).json({ _id : 0 });
  } else {
    res.sendStatus(400);
  }
});

router.delete('/category', function(req, res) {
  // TODO: delete category (and remove it from all freelancers)
  if (adminUsername === req.query.username && adminPassword === req.query.password) {
    res.sendStatus(204);
  } else {
    res.sendStatus(400);
  }
});

// router.delete('/claim', function(req, res) {
//   if (adminUsername === req.query.username && adminPassword === req.query.password) {
//     //TODO: delete claim from database
//     let transporter = nodemailer.createTransport({
//         service: 'Gmail',
//         auth: {
//             user: 'jobadvisor.group1@gmail.com',
//             pass: '-5#x3Y;R;u<fz6}l'
//         }
//     });
//     let mailOptions = {
//       from: 'jobadvisor.group1@gmail.com',
//       to: req.query.email,
//       subject: 'Claim request',
//       html: req.query.message
//     };
//     transporter.sendMail(mailOptions, function(err, info){
//       if(err){
//           res.sendStatus(500);
//       } else {
//           res.sendStatus(204);
//       };
//     });
//   } else {
//     res.sendStatus(400);
//   }
// });

/** router for root */
module.exports = router;
