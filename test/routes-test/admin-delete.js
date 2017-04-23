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

    it('should respond with 400 if no id is given', function(done) {
      request(app)
        .delete('/admin/category?username=admin&password=asd')
        .set('Ajax', 'true')
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("error", "no category id given");
            done();
          }
        });
    });

    it('should respond with 500 if invalid category', function(done) {
      request(app)
        .delete('/admin/category?username=admin&password=asd&id=invalidcategory')
        .set('Ajax', 'true')
        .expect(500)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("error", "database error while finding category");
            done();
          }
        });
    });

    it('should respond with 404 if invalid category', function(done) {
      request(app)
        .delete('/admin/category?username=admin&password=asd&id=000000000000000000000000')
        .set('Ajax', 'true')
        .expect(404)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("error", "category not found");
            done();
          }
        });
    });

    it('should respond with 401 if username is wrong', function(done) {
      request(app)
        .delete('/admin/category?username=wrongusername&password=asd')
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
        .delete('/admin/category?username=admin&password=wrongpassword')
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

  });

  describe('DELETE /admin/claim', function() {
    before(seed);
    after(utils.dropDbAndCloseConnection);

    var Cookies;
    var claimId;

    // WRONG
    it('should respond with 500 if invalid claim id is given', function(done) {
      request(app)
        .delete('/admin/claim?username=admin&password=asd&claimid=wrongid')
        .set('Ajax', 'true')
        .expect(500)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("error", "database error while finding claim");
            done();
          }
        });
    });

    // WRONG
    it('should respond with 404 if non-existent claim id is given', function(done) {
      request(app)
        .delete('/admin/claim?username=admin&password=asd&claimid=000000000000000000000000')
        .set('Ajax', 'true')
        .expect(404)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("error", "claim not found");
            done();
          }
        });
    });

    // WRONG
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

    // WRONG
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

    // WRONG
    it('should respond with 404 if freelancer not found', function(done) {
      request(app)
        .delete(`/admin/claim?username=admin&password=asd&claimid=${seedData[5].data[0]._id}`)
        .set('Ajax', 'true')
        .expect(404)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("error", "freelancer not found");
            done();
          }
        });
    });

    // WRONG
    it('should respond with 400 if freelancer is not claimed', function(done) {
      request(app)
        .delete(`/admin/claim?username=admin&password=asd&claimid=${seedData[5].data[1]._id}`)
        .set('Ajax', 'true')
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("error", "freelancer is not claimed");
            done();
          }
        });
    });

    // WRONG
    it('should respond with 404 if user not found', function(done) {
      request(app)
        .delete(`/admin/claim?username=admin&password=asd&claimid=${seedData[5].data[2]._id}`)
        .set('Ajax', 'true')
        .expect(404)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("error", "user not found");
            done();
          }
        });
    });

    // WRONG
    it('should respond with 400 if user is not claiming', function(done) {
      request(app)
        .delete(`/admin/claim?username=admin&password=asd&claimid=${seedData[5].data[3]._id}`)
        .set('Ajax', 'true')
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("error", "user is not claiming");
            done();
          }
        });
    });

    // WRONG
    it('should respond with 400 if user is already associtated with a freelancer', function(done) {
      request(app)
        .delete(`/admin/claim?username=admin&password=asd&claimid=${seedData[5].data[4]._id}`)
        .set('Ajax', 'true')
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("error", "user is already associtated with a freelancer");
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
