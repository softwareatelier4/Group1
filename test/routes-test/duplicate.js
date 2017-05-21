'use strict';

var mongoose   = require('mongoose');
var ObjectId   = mongoose.Types.ObjectId;

var should = require('should');
var config = require('../config');
var app = require(config.projectRoot + '/app');
var seedData = require('../../seed_data/seedData');
var seedDb = require('../../seed_data/seedDb');
var utils = require('../../seed_data/utils');
var compareutils = require('./utils');
var request = require('supertest');

describe('Duplicate test: ', function() {

  describe('POST /duplicate', function() {
    before(seed);
    after(utils.dropDbAndCloseConnection);

    var Cookies;
    var claimId;

    // LOGIN
    it('app should get answer 202 on POST /user/login with correct username and password', function(done) {
      request(app)
      .post('/user/login')
      .send({
        "username" : "Fuin",
        "password" : "fooly",
      })
      .expect(202).end(function(err,res) {
        var re = new RegExp('; path=/; httponly', 'gi');
        Cookies = res.headers['set-cookie'].map(function(r) {
            return r.replace(re, '');
          }).join("; ");
        done();
      });
    });

    // MAKE CLAIM
    it('app should get answer 201 on POST /claim/new if everything is correct', function(done) {
      let req = request(app).post('/claim/new');
      req.cookies = Cookies;
      req.expect(201)
      .send({
        freelancerId : seedData[1].data[0]
      })
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          res.body.should.have.property("_id");
          if (res.body._id) {
            claimId = res.body._id;
          }
          done();
        }
      });
    });

    // APPROVE CLAIM
    it('should respond with 204 if request is good', function(done) {
      request(app)
        .delete(`/admin/claim?username=admin&password=asd&claimid=${claimId}&choice=reject&message=abc&email=testemail`)
        .set('Ajax', 'true')
        .expect(204)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            done();
          }
        });
    });

    // WRONG REQUEST
    it('should respond with 400 if no originalID is given', function(done) {
      let req = request(app).post(`/duplicate`);
      req.cookies = Cookies;
      req.set('ajax', 'true')
        .send({
          duplicateID : seedData[1].data[1]._id
        })
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("error", "wrong duplicate request");
            done();
          }
        });
    });

    // WRONG REQUEST
    it('should respond with 400 if request no duplicateID is given', function(done) {
      let req = request(app).post(`/duplicate`);
      req.cookies = Cookies;
      req.set('ajax', 'true')
        .send({
          originalID : seedData[1].data[0]._id,
        })
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("error", "wrong duplicate request");
            done();
          }
        });
    });

    // WRONG REQUEST
    it('should respond with 500 if request originalID has wrong format', function(done) {
      let req = request(app).post(`/duplicate`);
      req.cookies = Cookies;
      req.set('ajax', 'true')
        .send({
          originalID : 'wrongformat',
          duplicateID : seedData[1].data[1]._id
        })
        .expect(500)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("error", "error in posting the duplicate");
            done();
          }
        });
    });

    // CORRECT REQUEST
    it('should respond with 201 if request is valid', function(done) {
      let req = request(app).post(`/duplicate`);
      req.cookies = Cookies;
      req.set('ajax', 'true')
        .send({
          originalID : seedData[1].data[0]._id,
          duplicateID : seedData[1].data[1]._id
        })
        .expect(201)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("userID", "590c66f0fc13ae73cd000029");
            res.body.should.have.property("originalID", seedData[1].data[0]._id);
            res.body.should.have.property("duplicateID", seedData[1].data[1]._id);
            done();
          }
        });
    });

    // WRONG REQUEST
    it('should respond with 400 if request already exists', function(done) {
      let req = request(app).post(`/duplicate`);
      req.cookies = Cookies;
      req.set('ajax', 'true')
        .send({
          originalID : seedData[1].data[0]._id,
          duplicateID : seedData[1].data[1]._id
        })
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("error", "already exists a duplicate with this data");
            done();
          }
        });
    });

  });

});

function seed(done) {
  //seed the db
  seedDb.seed(function(err, seedData) {
    if (err) return done(err);
    done();
  });
}
