var config = require('../config');

module.exports = {
  'Freelancer Profile View' : function (client) {
    client
      .url( config.baseURL + '/freelance/58cc4941fc13ae612c00000a')
      .useCss()
      .waitForElementVisible('body', 1000)
      .waitForElementPresent('div#freelancer-root', 1000)
      .assert.containsText('h1.freelancer-header-name', 'Irene Larson')
      .assert.containsText('span.freelancer-header-title', 'VP Marketing')
      .assert.containsText('a.freelancer-email', 'ilarson0@cnbc.com')
      .assert.containsText('div.freelancer-description', 'Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue.')
      .waitForElementPresent('ul.tag-list', 1000)
      .waitForElementPresent('div#freelancer-reviews-root', 1000)
      .end();
  }
};
