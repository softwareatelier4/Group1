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

describe('Admin-delete test: ', function() {

  describe('DELETE /admin/category', function() {
    before(seed);
    after(utils.dropDbAndCloseConnection);

    it('should respond with 204 if request is valid', function(done) {
      request(app)
        .delete('/admin/category?username=admin&password=asd&id=' + seedData[3].data[0]._id)
        .set('Ajax', 'true')
        .expect(204, done);
    });

    it('should respond with 401 if no id is given', function(done) {
      request(app)
        .delete('/admin/category?username=admin&password=asd')
        .set('Ajax', 'true')
        .expect(401, done);
    });

    it('should respond with 401 if username is wrong', function(done) {
      request(app)
        .delete('/admin/category?username=wrongusername&password=asd')
        .set('Ajax', 'true')
        .expect(401, done);
    });

    it('should respond with 401 if password is wrong', function(done) {
      request(app)
        .delete('/admin/category?username=admin&password=wrongpassword')
        .set('Ajax', 'true')
        .expect(401, done);
    });

  });

  describe('DELETE /admin/claim', function() {
    before(seed);
    after(utils.dropDbAndCloseConnection);

    var Cookies;
    var claimId;

    it('should respond with 400 if wrong id is given', function(done) {
      request(app)
        .delete('/admin/claim?username=admin&password=asd&claimid=wrongid')
        .set('Ajax', 'true')
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("error", "invalid claim id");
            done();
          }
        });
    });

    it('should respond with 401 if username is wrong', function(done) {
      request(app)
        .delete('/admin/claim?username=wrongusername&password=asd')
        .set('Ajax', 'true')
        .expect(401)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("error", "wrong username or password");
            done();
          }
        });
    });

    it('should respond with 401 if password is wrong', function(done) {
      request(app)
        .delete('/admin/claim?username=admin&password=wrongpassword')
        .set('Ajax', 'true')
        .expect(401)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("error", "wrong username or password");
            done();
          }
        });
    });

    // LOGIN
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

    // WRONG
    it('should respond with 400 if invalid choice', function(done) {
      request(app)
        .delete(`/admin/claim?username=admin&password=asd&claimid=${claimId}&choice=wrongchoice&message=abc&email=testemail`)
        .set('Ajax', 'true')
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("error", "invalid choice");
            done();
          }
        });
    });

    // CORRECT
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

    // CORRECT
    it('should respond with 204 if request is good', function(done) {
      request(app)
        .delete(`/admin/claim?username=admin&password=asd&claimid=${claimId}&choice=accept&message=abc&email=testemail`)
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

  });

});

function seed(done) {
  //seed the db
  seedDb.seed(function(err, seedData) {
    if (err) return done(err);
    done();
  });
}
