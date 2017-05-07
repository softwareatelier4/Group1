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

describe('Admin-post test: ', function() {

  describe('POST /admin/category', function() {
    before(seed);
    after(utils.dropDbAndCloseConnection);

    it('should get answer 201 on POST /admin/category and add required id document', function(done) {
      request(app)
        .post('/admin/category?username=admin&password=asd')
        .send({
          categoryName : 'testCategory'
        })
        .set('Ajax', 'true')
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(201)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            let documentsArray = [];
            documentsArray.push(
              {
                name : "id",
                required : true
              }
            );
            documentsArray.push(
              {
                name : "other",
                required : false
              }
            );
            res.body.should.have.property("categoryName", "testCategory");
            res.body.should.have.property("documents", documentsArray);
            done();
          }
        });
    });

    it('should respnd with 400 if no categoryName was given', function(done) {
      request(app)
        .post('/admin/category?username=admin&password=asd')
        .set('Ajax', 'true')
        .expect('Content-Type', /json/, 'it should respond with json')
        .expect(400)
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("error", "no category name given");
            done();
          }
        });
    });

    it('should respond with 401 if username is wrong', function(done) {
      request(app)
        .post('/admin/category?username=wrongusername&password=asd')
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
        .post('/admin/category?username=admin&password=wrongpassword')
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

  describe('POST /admin/category/document', function() {
    before(seed);
    after(utils.dropDbAndCloseConnection);

    // CORRECT: POST: /admin/category/document adds document (res.status: 201)
    it('should respond 201 on POST /admin/category/document and add the document', function(done) {
      request(app)
      .post('/admin/category/document?username=admin&password=asd&id=58cc4b15fc13ae5ec7000123')
      .send({
        name : "Degree",
        required : true
      })
      .set('Ajax', 'true')
      .expect('Content-Type', /json/, 'it should respond with json')
      .expect(201)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          res.body.should.have.property("name", "Degree");
          res.body.should.have.property("required", true);
          done();
        }
      });
    });

    // ERROR: POST: /admin/category/document not admin (401)
    it('should respond 401 on POST /admin/category/document if not admin', function(done) {
      request(app)
      .post('/admin/category/document?username=wannabe_admin&password=pls_can_i_be_admin&id=58cc4b15fc13ae5ec7000123')
      .send({
        name : "Degree",
        required : true
      })
      .set('Ajax', 'true')
      .expect('Content-Type', /json/, 'it should respond with json')
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

    // ERROR: POST: /admin/category/document category not given (400)
    it('should respond 400 on POST /admin/category/document if no category id is given', function(done) {
      request(app)
      .post('/admin/category/document?username=admin&password=asd')
      .send({
        name : "Degree",
        required : true
      })
      .set('Ajax', 'true')
      .expect('Content-Type', /json/, 'it should respond with json')
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

    // ERROR: POST: /admin/category/document no doc.name (400)
    it('should respond 400 on POST /admin/category/document if no document.name is given', function(done) {
      request(app)
      .post('/admin/category/document?username=admin&password=asd&id=58cc4b15fc13ae5ec7000123')
      .send({
        required : true
      })
      .set('Ajax', 'true')
      .expect('Content-Type', /json/, 'it should respond with json')
      .expect(400)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          res.body.should.have.property("error", "document fields are missing or of the wrong type");
          done();
        }
      });
    });

    // ERROR: POST: /admin/category/document no doc.required (400)
    it('should respond 400 on POST /admin/category/document if no document.required is given', function(done) {
      request(app)
      .post('/admin/category/document?username=admin&password=asd&id=58cc4b15fc13ae5ec7000123')
      .send({
        name : "Degree"
      })
      .set('Ajax', 'true')
      .expect('Content-Type', /json/, 'it should respond with json')
      .expect(400)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          res.body.should.have.property("error", "document fields are missing or of the wrong type");
          done();
        }
      });
    });

    // ERROR: POST: /admin/category/document name not string (400)
    it('should respond 400 on POST /admin/category/document if document.name is not a string', function(done) {
      request(app)
      .post('/admin/category/document?username=admin&password=asd&id=58cc4b15fc13ae5ec7000123')
      .send({
        name : 1,
        required : true
      })
      .set('Ajax', 'true')
      .expect('Content-Type', /json/, 'it should respond with json')
      .expect(400)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          res.body.should.have.property("error", "document fields are missing or of the wrong type");
          done();
        }
      });
    });

    // ERROR: POST: /admin/category/document required not bool (400)
    it('should respond 400 on POST /admin/category/document if document.required is not a boolean', function(done) {
      request(app)
      .post('/admin/category/document?username=admin&password=asd&id=58cc4b15fc13ae5ec7000123')
      .send({
        name : "Degree",
        required : "of course it's required, you didn't study for nothing"
      })
      .set('Ajax', 'true')
      .expect('Content-Type', /json/, 'it should respond with json')
      .expect(400)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          res.body.should.have.property("error", "document fields are missing or of the wrong type");
          done();
        }
      });
    });

    // ERROR: POST: /admin/category/document db error category (500)
    it('should respond 500 on POST /admin/category/document if category id is invalid', function(done) {
      request(app)
      .post('/admin/category/document?username=admin&password=asd&id=something_which_is_not_a_valid_id')
      .send({
        name : "Degree",
        required : true
      })
      .set('Ajax', 'true')
      .expect('Content-Type', /json/, 'it should respond with json')
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

  });

});

function seed(done) {
  //seed the db
  seedDb.seed(function(err, seedData) {
    if (err) return done(err);
    done();
  });
}
