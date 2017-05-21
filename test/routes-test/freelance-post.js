'use strict';

var mongoose   = require('mongoose');
var ObjectId   = mongoose.Types.ObjectId;

var should = require('should');
var config = require('../config');
var app = require(config.projectRoot + '/app');
var seedData = require('../../seed_data/seedData');
var seedDb = require('../../seed_data/seedDb');
var utils = require('../../seed_data/utils');
var freelanceutils = require('./utils');
var request = require('supertest');

describe('Freelance-post test: ', function() {

  describe('POST /freelance', function() {

    before(seed);
    after(utils.dropDbAndCloseConnection);

    // TEST: correct post.
    it('app should get answer 201 on POST /freelance', function(done) {
      request(app)
      .post('/freelance')
      .send({
        "firstName" : "Patrick",
        "familyName" : "Balestra",
        "title" : "Human Being",
        "email" : "user@email.com",
        "tags" : "ciao, ciao2, ciao3",
        "description" : "Best description.",
        "urlPicture" : "https://i.ytimg.com/vi/tntOCGkgt98/maxresdefault.jpg",
        "price" : {},
      })
      .expect(201)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          res.body.should.have.property("firstName", "Patrick");
          res.body.should.have.property("familyName", "Balestra");
          res.body.should.have.property("email", "user@email.com");
          res.body.should.have.property("title", "Human Being");
          res.body.should.have.property("price");
          res.body.should.have.property("tags");
          res.body.should.have.property("description");
          res.body.should.have.property("urlPicture");
          done();
        }
      });
    });

    // TEST: not correct post: missing required properties.
    it('app should get answer 400 on POST /freelance', function(done) {
      request(app)
      .post('/freelance')
      .send({"email" : "user@email.com"})
      .expect(400)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          res.body.should.have.property("errors", ["Path `title` is required.", "Path `firstName` is required."]);
          done();
        }
      });
    });

    // TEST: not correct post: missing required properties.
    it('app should get answer 400 on POST /freelance', function(done) {
      request(app)
      .post('/freelance')
      .send({"firstName" : "Patrick"})
      .expect(400)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          res.body.should.have.property("errors", ["Path `email` is required.", "Path `title` is required."]);
          done();
        }
      });
    });
  });

  describe('POST /freelance/:freelanceid/review', function() {

    before(seed);
    after(utils.dropDbAndCloseConnection);

    // TEST: correct post of a review.
    it('app should get answer 201 on POST /freelance/:freelanceid/review', function(done) {
      request(app)
      .post('/freelance/' + seedData[1].data[0]._id.toString() + '/review')
      .send({
        "author" : "Patrick",
        "text" : "This is a comment.",
        "score" : 0
      })
      .expect(201)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          res.should.have.property("text");
          done();
        }
      });
    });

    it('should respond with a 400 if the given freelance ID is not valid', function(done) {
      request(app)
        .post('/freelance/' + 'literally_anything_which_is_not_in_the_correct_format/review')
        .set('Accept', 'application/json')
        .expect(400, done);
    });

    it('should respond with a 404 if the given freelance ID is not in the database', function(done) {
      request(app)
        .post('/freelance/' + ObjectId().toString() + '/review')
        .set('Accept', 'application/json')
        .expect(404, done);
    });

  });

  // Test posting of reply to review
  describe('POST /freelance/:freelanceid/review', function() {

    before(seed);
    after(utils.dropDbAndCloseConnection);

    // TEST: correct post of a reply to a review.
    it('app should get answer 201 on POST reply /freelance/:freelanceid/review', function(done) {
      request(app)
      .post('/freelance/' + seedData[1].data[0]._id.toString() + '/review')
      .send({
        "author" : "Patrick",
        "text" : "This is a a reply to a review.",
        "score" : 0,
        "reply" : "58cc4415fc13ae5afb0000c8"
      })
      .expect(201)
      .end(function(err, res) {
        if (err) {
          done(err);
        } else {
          var review = JSON.parse(res.text) || {};
          review.should.have.property("reply");
          review.should.have.property("_id", "58cc4415fc13ae5afb0000c8");
          done();
        }
      });
    });

    it('should respond with a 404 if the given freelance ID is not in the database', function(done) {
      request(app)
        .post('/freelance/' + ObjectId().toString() + '/review')
        .set('Accept', 'application/json')
        .expect(404, done);
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
