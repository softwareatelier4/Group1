var config = require('../config');

module.exports = {
  'Freelancer Profile View' : function (client) {
    client
      .url( config.baseURL + '/freelance/5837133bcb98f316ac473850')
      .useCss()
      .waitForElementVisible('body', 1000)
      .waitForElementPresent('div#freelancer-root', 1000)
      .waitForElementPresent('div#freelancer-reviews-root', 1000)
      .end();
  }
};
