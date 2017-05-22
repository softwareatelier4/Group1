/** @module duplicate/router */
'use strict';

const express = require('express');
const router = express.Router();
const middleware =  require('../middleware');
const utils = require('../utils');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Duplicate = mongoose.model("Duplicate");

router.post("/", function(req, res, next) {
    if (!req.session.user_id || !req.body.originalID || !req.body.duplicateID) {
        res.status(400).json({error: 'wrong duplicate request'}); // TESTED
    } else {
        let newDuplicate = new Duplicate({
            userID : req.session.user_id,
            duplicateID : req.body.duplicateID,
            originalID : req.body.originalID
        });
        Duplicate.findOne({
            userID : newDuplicate.userID,
            duplicateID : newDuplicate.duplicateID,
            originalID : newDuplicate.originalID
        }).exec(function(err, foundDuplicate) {
            if (err) {
                res.status(500).json({error: 'error while finding duplicate in database'}); // CANNOT TEST
            } else if (foundDuplicate) {
                res.status(400).json({error: 'already exists a duplicate with this data'}); // TESTED
            } else {
                newDuplicate.save(function(err, saved) {
                    if (err) {
                        res.status(500).json({error: 'error in posting the duplicate'}); // TESTED
                    } else {
                        res.status(201).json(saved); // TESTED
                    }
                });
            }
        });
    }
});

module.exports = router;
