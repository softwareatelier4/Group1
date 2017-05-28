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

describe('Freelance-put test: ', function() {

  describe('PUT /freelance/:freelanceid/availability', function() {
    before(seed);
    after(utils.dropDbAndCloseConnection);

    // CORRECT: PUT: /freelance/:id/availability with existing id
    it('should respond with 204 and update availability correctly for existing freelancer', function(done) {
      let data = [];
      data.push({
        "day" : new Date(),
        "begin" : new Date(),
        "end" : new Date(),
        "location" : "behind you"
      });
      data.push({
        "day" : new Date(),
        "begin" : new Date(),
        "end" : new Date(),
        "location" : "Hawaii"
      });

      request(app)
      .put('/freelance/58cc4941fc13ae612c00000a/availability')
      .set('Accept', 'application/json')
      .send(data)
      .expect(204)
      .end(done);
    });

    // ERROR: PUT: /freelance/:id/availability with non-existing id
    it('should respond with 404 for non-existing freelancer', function(done) {
      let data = [];
      data.push({
        "day" : new Date(),
        "begin" : new Date(),
        "end" : new Date(),
        "location" : "behind you"
      });
      data.push({
        "day" : new Date(),
        "begin" : new Date(),
        "end" : new Date(),
        "location" : "Hawaii"
      });

      request(app)
      .put('/freelance/' + new ObjectId() + '/availability')
      .set('Accept', 'application/json')
      .send(data)
      .expect(404)
      .end(done);
    });

    // ERROR: PUT: /freelance/:id/availability wrong day.day in body
    it('should respond with 400 if one of the Days has wrong day.day', function(done) {
      let data = [];
      data.push({
        "day" : "a day, but not really a date",
        "begin" : new Date(),
        "end" : new Date(),
        "location" : "Hawaii"
      });

      request(app)
      .put('/freelance/58cc4941fc13ae612c00000a/availability')
      .set('Accept', 'application/json')
      .send(data)
      .expect(400)
      .end(function(err, res) {
        if (err) {
          console.error("\x1b[31m", '"day" : "a day, but not really a date" should not be accepted');
          done(err);
        } else done();
      });
    });

    // ERROR: PUT: /freelance/:id/availability wrong day.begin in body
    it('should respond with 400 if one of the Days has wrong day.begin', function(done) {
      let data = [];
      data.push({
        "day" : new Date(),
        "begin" : "something",
        "end" : new Date(),
        "location" : "Hawaii"
      });

      request(app)
      .put('/freelance/58cc4941fc13ae612c00000a/availability')
      .set('Accept', 'application/json')
      .send(data)
      .expect(400)
      .end(function(err, res) {
        if (err) {
          console.error("\x1b[31m", '"begin" : "something" should not be accepted');
          done(err);
        } else done();
      });
    });

    // ERROR: PUT: /freelance/:id/availability wrong day.end in body
    it('should respond with 400 if one of the Days has wrong day.end', function(done) {
      let data = [];
      data.push({
        "day" : new Date(),
        "begin" : new Date(),
        "end" : "end date, but written like this it is not a Date",
        "location" : "Hawaii"
      });

      request(app)
      .put('/freelance/58cc4941fc13ae612c00000a/availability')
      .set('Accept', 'application/json')
      .send(data)
      .expect(400)
      .end(function(err, res) {
        if (err) {
          console.error("\x1b[31m", '"end" : "end date, but written like this it is not a Date" should not be accepted');
          done(err);
        } else done();
      });
    });

    // ERROR: PUT: /freelance/:id/availability wrong day.location in body
    it('should respond with 400 if one of the Days has wrong day.location', function(done) {
      let data = [];
      data.push({
        "day" : new Date(),
        "begin" : new Date(),
        "end" : new Date(),
        "location" : 1
      });

      request(app)
      .put('/freelance/58cc4941fc13ae612c00000a/availability')
      .set('Accept', 'application/json')
      .send(data)
      .expect(400)
      .end(function(err, res) {
        if (err) {
          console.error("\x1b[31m", '"location" : 1 should not be accepted');
          done(err);
        } else done();
      });
    });

    // ERROR: GET: /freelance/:id/availability unsupported method
    it('should respond with a 405 if the method is not PUT or OPTIONS', function(done) {
      let data = [];
      data.push({
        "day" : new Date(),
        "begin" : new Date(),
        "end" : new Date(),
        "location" : "behind you"
      });
      data.push({
        "day" : new Date(),
        "begin" : new Date(),
        "end" : new Date(),
        "location" : "Hawaii"
      });

      request(app)
      .get('/freelance/58cc4941fc13ae612c00000a/availability')
      .set('Accept', 'application/json')
      .send(data)
      .expect(405)
      .end(done);
    });

  });

  describe('PUT /freelance/:freelanceid/edit', function(){
    before(seed);
    after(utils.dropDbAndCloseConnection);

    var Cookies;

    // LOGIN
    it('app should get answer 202 on POST /user/login with correct username and password', function(done) {
      request(app)
      .post('/user/login')
      .send({
        "username" : seedData[4].data[5].username, //Robb Bis
        "password" : seedData[4].data[5].password, //perdonamierastil
      })
      .expect(202).end(function(err,res) {
        var re = new RegExp('; path=/; httponly', 'gi');
        Cookies = res.headers['set-cookie'].map(function(r) {
            return r.replace(re, '');
          }).join("; ");
        done();
      });
    });

    //WRONG
    it('should return 403 if user is not allowed to edit that freelance', function(done) {
      let req = request(app)
        .put('/freelance/'+ seedData[1].data[3]._id.toString() + '/edit')
        .set('Accept', 'application/json')
        .set('Ajax', 'true');
      req.cookies = Cookies;
      req.expect(403)
        .send({
          firstName : "empty"
        })
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("error", "user not allowed to edit");
            done();
          }
        });
    });

    it('should return 201 for success editing of allowed fields', function(done) {
      let req = request(app)
        .put('/freelance/'+ seedData[1].data[0]._id.toString() + '/edit')
        .set('Accept', 'application/json')
        .set('Ajax', 'true');
      req.cookies = Cookies;
      req.expect(201)
        .send({
          phone : "6666",
          address : "Celiax"
        })
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("phone", "6666");
            res.body.should.have.property("address", "Celiax");
            done();
          }
        });
    });

    it('should not modify not allowed fields', function(done) {
      let oldName = seedData[1].data[0].firstName;
      let oldTitle = seedData[1].data[0].title;
      let req = request(app)
        .put('/freelance/'+ seedData[1].data[0]._id.toString() + '/edit')
        .set('Accept', 'application/json')
        .set('Ajax', 'true');
      req.cookies = Cookies;
      req.expect(201)
        .send({
          firstName : "Lanaya",
          title : "GOD"
        })
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("firstName", oldName);
            res.body.should.have.property("title", oldTitle);
            done();
          }
        });
    });

    it('should add new tags when the request contains new tags', function(done) {
      let oldName = seedData[1].data[0].firstName;
      let oldTitle = seedData[1].data[0].title;
      let req = request(app)
        .put('/freelance/'+ seedData[1].data[0]._id.toString() + '/edit')
        .set('Accept', 'application/json')
        .set('Ajax', 'true');
      req.cookies = Cookies;
      req.expect(201)
        .send({
          tags : "testingtag1,testing2,testerino3"
        })
        .end(function(err, res) {
          if (err) {
            done(err);
          } else {
            res.body.should.have.property("tags").with.lengthOf(3);;
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
