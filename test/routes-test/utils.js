/** @module test/freelance/utils
* Utilities for the routes tests
*/

module.exports.checkFreelanceInfoInResponse = function checkFreelanceInfoInResponse(responseObj, freelance){
  Object.keys(freelance).forEach(function(key) {
    if (key == "tags") {
      responseObj.tags.forEach(function(tag) {
        tag.should.have.property("_id");
        tag.should.have.property("tagName");
        tag.should.have.property("freelancers");
      });
    } else if (key == "reviews") {
      // Test for reviews in a freelance
      responseObj.reviews.forEach(function(review) {
        review.should.have.property("_id");
        review.should.have.property("author");
        review.should.have.property("date");
        review.should.have.property("text");
      });
    } else {
      responseObj.should.have.property(key, freelance[key]);
    }
  });
}
