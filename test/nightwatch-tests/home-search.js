var config = require('../config');

module.exports = {
  'Simple search' : function (client) {
    client
      .url( config.baseURL + '/')
      .useCss()
      .waitForElementVisible('body', 1000)
      .waitForElementPresent('input', 1000)
      .setValue('input', 'VP Marketing')
      .click('button#search-btn')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('div#freelancers-container', 1000)
      .waitForElementVisible('div.freelancer-card', 1000)
      .click('div.freelancer-card')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('span.freelancer-header-title', 1000)
      .assert.containsText('span.freelancer-header-title', 'VP Marketing')
      .end();
  }
};
