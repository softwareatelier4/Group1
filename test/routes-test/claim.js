'use strict';

var mongoose   = require('mongoose');
var ObjectId   = mongoose.Types.ObjectId;

var should = require('should');
var config = require('../config');
var app = require(config.projectRoot + '/app');
var seedData = require('../../seed_data/seedData');
var seedDb = require('../../seed_data/seedDb');
var utils = require('../../seed_data/utils');
var request = require('supertest');

describe('Claim-post test: ', function() {

  describe('POST /claim', function() {

    before(seed);
    after(utils.dropDbAndCloseConnection);

    var Cookies;

    // WRONG
    it('app should get answer 451 on POST /claim/new if user is not logged in', function(done) {
      request(app)
      .post('/claim/new')
      .expect(451)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          res.body.should.have.property("error", "no user id or freelancer id");
          done();
        }
      });
    });

    // NEEDED FOR LOGIN
    it('app should get answer 202 on POST /user/login with correct username and password', function(done) {
      request(app)
      .post('/user/login')
      .send({
        "username" : "MrSatan",
        "password" : "666",
      })
      .expect(202).end(function(err,res) {
        var re = new RegExp('; path=/; httponly', 'gi');
        Cookies = res.headers['set-cookie'].map(function(r) {
            return r.replace(re, '');
          }).join("; ");
        done();
      });
    });

    // WRONG
    it('app should get answer 451 on POST /claim/new if no freelancer id was given', function(done) {
      let req = request(app).post('/claim/new');
      req.cookies = Cookies;
      req.expect(451)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          res.body.should.have.property("error", "no user id or freelancer id");
          done();
        }
      });
    });

    // WRONG
    it('app should get answer 500 on POST /claim/new if invalid freelancer id', function(done) {
      let req = request(app).post('/claim/new');
      req.cookies = Cookies;
      req.expect(500)
      .send({
        freelancerId : 'invalidfreelancerid'
      })
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          res.body.should.have.property("error", "database error while finding freelancer");
          done();
        }
      });
    });

    // WRONG
    it('app should get answer 404 on POST /claim/new if freelancer not found', function(done) {
      let req = request(app).post('/claim/new');
      req.cookies = Cookies;
      req.expect(404)
      .send({
        freelancerId : '000000000000000000000000'
      })
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          res.body.should.have.property("error", "freelancer not found");
          done();
        }
      });
    });

    // CORRECT
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
          done();
        }
      });
    });

    // WRONG
    it('app should get answer 452 on POST /claim/new if user is already claiming', function(done) {
      let req = request(app).post('/claim/new');
      req.cookies = Cookies;
      req.expect(452)
      .send({
        freelancerId : seedData[1].data[1]
      })
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          res.body.should.have.property("error", "user id already claiming");
          done();
        }
      });
    });

    // NEEDED FOR LOGIN
    it('app should get answer 202 on POST /user/login with correct username and password', function(done) {
      request(app)
      .post('/user/login')
      .send({
        "username" : "Smaug",
        "password" : "ilovegold",
      })
      .expect(202).end(function(err,res) {
        var re = new RegExp('; path=/; httponly', 'gi');
        Cookies = res.headers['set-cookie'].map(function(r) {
            return r.replace(re, '');
          }).join("; ");
        done();
      });
    });

    // WRONG
    it('app should get answer 453 on POST /claim/new if freelance is already claimed', function(done) {
      let req = request(app).post('/claim/new');
      req.cookies = Cookies;
      req.expect(453)
      .send({
        freelancerId : seedData[1].data[0]
      })
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          res.body.should.have.property("error", "freelancer id already verified");
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
