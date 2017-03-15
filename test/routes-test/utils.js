/** @module test/freelance/utils
* Utilities for the routes tests
*/

module.exports.checkFreelanceInfoInResponse = function checkFreelanceInfoInResponse(responseObj, freelance){
  // console.log(responseObj);
  // console.log(responseObj.indexOf('price'));
  Object.keys(freelance).forEach(function(key) {
    responseObj.should.have.property(key, freelance[key]);
    // responseObj.indexOf(freelance[key]).should.be.greaterThan(-1, "" + key + " should be there");
  });

  // TODO test that reviews have important fields
  if(!freelance.reviews) return;
  freelance.reviews.forEach(function(review) {
    // responseObj.indexOf(review.toString())
    // .should.be.greaterThan(-1, "tracks should be there");
  });
}
