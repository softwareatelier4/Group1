'use strict';

var should = require('should');
var config = require('../config');
var app = require(config.projectRoot + '/app');
var seedData = require('../../seed_data/seedData');
var seedDb = require('../../seed_data/seedDb');
var utils = require('../../seed_data/utils');
var freelanceutils = require('./utils');
var request = require('supertest');

describe('Freelance-post test: ', function() {

  before(seed);
  // after(utils.dropDb);

  // TEST: correct post.
  it('app should get answer 201 on POST /freelance', function(done) {
    request(app)
    .post('/freelance')
    .send({
      "firstName" : "Patrick",
      "familyName" : "Balestra",
      "email" : "user@email.com",
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
        res.body.should.have.property("price");
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
        res.body.should.have.property("errors", ["Path `price` is required.", "Path `familyName` is required.", "Path `firstName` is required."]);
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
        res.body.should.have.property("errors", ["Path `price` is required.", "Path `email` is required.", "Path `familyName` is required."]);
        done();
      }
    });
  });
});

// TEST: correct post of a review.
it('app should get answer 201 on POST /freelance/:freelanceid/review', function(done) {
  request(app)
  .post('/freelance/' + seedData[0].data[0]._id.toString() + '/review')
  .send({
    "author" : "Patrick",
    "text" : "This is a comment."
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

function seed(done) {
  //seed the db
  seedDb.seed(function(err, seedData) {
    if (err) return done(err);
    done();
  });
}
