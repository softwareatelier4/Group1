var config = require('../config');

module.exports = {
  'Simple search' : function (client) {
    client
      .url( config.baseURL + '/')
      .useCss()
      .waitForElementVisible('body', 1000)
      .waitForElementPresent('input[name=search-what]', 10000)
      .setValue('input[name=search-what]', 'VP')
      .waitForElementPresent('input[name=search-where]', 10000)
      .setValue('input[name=search-where]', 'Milano')
      .click('button#search-btn')
      .pause(5000)
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('div#freelancers-container', 1000)
      .waitForElementVisible('div.freelancer-card', 1000)
      .assert.containsText('span[name=distance-58cc4941fc13ae612c00000a]', 'km') // valid distance received
      .click('div.freelancer-card')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('span.freelancer-header-title', 1000)
      .assert.containsText('span.freelancer-header-title', 'VP')
      .end();
  }
};
