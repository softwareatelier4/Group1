/** @module test/freelance/utils
* Utilities for the routes tests
*/

module.exports.checkFreelanceInfoInResponse = function checkFreelanceInfoInResponse(responseObj, freelance){
  Object.keys(freelance).forEach(function(key) {
    if (key != "reviews") {
      responseObj.should.have.property(key, freelance[key]);
    } else {
      // Test for revies in a freelance
      responseObj.reviews.forEach(function(review) {
        review.should.have.property("_id");
        review.should.have.property("author");
        review.should.have.property("date");
        review.should.have.property("text");
      })
    }
  });
}
