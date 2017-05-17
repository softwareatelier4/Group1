var config = require('../config');

module.exports = {
  'Freelancer Create View' : function (client) {
    client
      .url( config.baseURL + '/freelance/new')
      .useCss()
      .waitForElementVisible('body', 1000)
      .waitForElementPresent('div#freelancer-root', 10000)
      // add someone else
      .click('button#freelancer-other')
      .assert.containsText('h1#freelancer-form-title', 'Create a freelancer profile for someone else')
      .assert.visible('input[name=first-name]')
      .assert.visible('input[name=family-name]')
      .assert.visible('input[name=job-title]')
      .assert.visible('input[name=job-description]')
      .assert.visible('input[name=job-tags]')
      .assert.visible('select[name="category"]')
      .assert.visible('input[name=address]')
      .assert.visible('input[name=phone]')
      .assert.visible('input[name=email]')
      .setValue('input[name=first-name]', 'Nightwatch')
      .setValue('input[name=job-title]', 'Tester')
      .setValue('input[name=job-description]', 'Nightwatch Tester Wow')
      .setValue('input[name=job-tags]', 'Nightwatch ,   Tester, Wow')
      .click('select[name="category"] option[value="58cc4b15fc13ae5ec7000124"]')
      .setValue('input[name=address]', 'USI, Lugano')
      .setValue('input[name=email]', 'test@night.watch')
      .click('input[name=submit-button]')
      .waitForElementVisible('div.freelancer-view', 10000)
      .assert.containsText('h1.freelancer-header-name', 'Nightwatch')
      .assert.containsText('span.freelancer-category', 'Engineering')
      .assert.containsText('a.freelancer-address', 'USI, Lugano')
      .assert.containsText('a.freelancer-email', 'test@night.watch')
      .assert.containsText('ul.tag-list li:first-child', 'Nightwatch')
      // add yourself
      .url( config.baseURL + '/freelance/new')
      // test alert if not logged in
      .click('button#freelancer-myself')
      .pause(1000)
      .acceptAlert()
      // login
      .setValue('input[name=login-username]', 'Bilbo')
      .setValue('input[name=login-password]', 'baggins')
      .click('input[name=login-submit]')
      .waitForElementPresent('button#freelancer-myself', 2000)
      .click('button#freelancer-myself')
      .pause(500)
      .assert.containsText('h1#freelancer-form-title', 'Create your own freelancer profile')
      .setValue('input[name=first-name]', 'Bilbo Baggins')
      .setValue('input[name=job-title]', 'Tester')
      .assert.elementNotPresent('div#required-docs li:first-child')
      .assert.elementNotPresent('div#optional-docs li:first-child')
      .click('select[name="category"] option[value="58cc4b15fc13ae5ec7000123"]')
      .assert.elementPresent('div#required-docs li:first-child')
      .assert.elementPresent('div#optional-docs li:first-child')
      .assert.containsText('div#required-docs li:first-child', 'id')
      .assert.containsText('div#optional-docs li:first-child', 'other')
      .setValue('input[name=address]', 'USI, Lugano')
      .setValue('input[name=email]', 'test@bilbo.myself')
      // Cannot do the following, since can't figure out how to 'upload' multiple required files with Nightwatch
      // .setValue('input#freelancer-claim-form-files', config.projectRoot + '/README.md')
      // .click('input[name=submit-button]')
      // .pause(2000)
      // .assert.containsText('div#freelancer-claim-status-name', 'IN PROGRESS')
      .end();
  }
};
