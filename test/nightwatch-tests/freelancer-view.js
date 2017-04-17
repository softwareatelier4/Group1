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
      // submit review
      .assert.visible('input[name=score]')
      .assert.visible('input[id=score-3]')
      .assert.visible('textarea[name=comment]')
      .click('input[id=score-3]')
      .click('textarea[name=comment]')
      .setValue('textarea[name=comment]', 'Nightwatch is the best reviewer')
      .click('input[name=submit-button]')
      .pause(2000)
      .assert.containsText('div.review-text', 'Nightwatch is the best reviewer')
      // submit empty review
      .assert.visible('input[name=score]')
      .assert.visible('input[id=score-5]')
      .click('input[id=score-5]')
      .click('input[name=submit-button]')
      .pause(2000)
      // test empty review not listed
      .assert.hidden('div.review-text')
      .end();
  }
};
