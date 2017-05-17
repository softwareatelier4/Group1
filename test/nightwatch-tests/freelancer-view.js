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
      // check review hidden if not logged in
      .waitForElementPresent('div#freelancer-reviews-root', 1000)
      // login
      .waitForElementPresent('div#react-login', 1000)
      .setValue('input[name=login-username]', 'MrSatan')
      .setValue('input[name=login-password]', '666')
      .click('input[name=login-submit]')
      // check review form visible
      .waitForElementPresent('div#freelancer-logged-reviews-root', 5000)
      // submit review
      .assert.visible('input[name=score]')
      .assert.visible('input[id=score-3]')
      .assert.visible('textarea[name=comment]')
      .click('input[id=score-3]')
      .click('textarea[name=comment]')
      .setValue('textarea[name=comment]', 'Nightwatch is the best reviewer')
      .click('input[name=submit-button]')
      .pause(2000)
      .assert.containsText('span.review-author', 'MrSatan')
      .assert.containsText('div.review-text', 'Nightwatch is the best reviewer')
      // submit empty review
      .assert.visible('input[name=score]')
      .assert.visible('input[id=score-5]')
      .click('input[id=score-5]')
      .click('input[name=submit-button]')
      .pause(2000)
      // test empty review not listed
      .assert.hidden('div.review-text')
      // claim
      .waitForElementPresent('div#freelancer-claim', 1000)
      .assert.containsText('div#freelancer-claim-status-name', 'NOT VERIFIED')
      .click('button#freelancer-claim-toggle')
      .waitForElementPresent('div#freelancer-claim-form', 5000)
      .click('button#freelancer-claim-btn')
      .pause(2000)
      .assert.containsText('div#freelancer-claim-form-message', 'Not enough required files submitted')
      // display of correct document types
      .assert.containsText('div#required-docs li:first-child', 'id')
      .assert.containsText('div#optional-docs li:last-child', 'other')
      // Cannot do the following, since can't figure out how to 'upload' multiple required files with Nightwatch
      //.setValue('input#freelancer-claim-form-files', config.projectRoot + '/README.md')
      // .click('button#freelancer-claim-btn')
      // .pause(2000)
      // .assert.containsText('div#freelancer-claim-status-name', 'IN PROGRESS')

      .end();
  }
};
