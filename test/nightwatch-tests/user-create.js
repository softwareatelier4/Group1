var config = require('../config');

module.exports = {
  'User Registration View' : function (client) {
    client
      .url( config.baseURL + '/')
      .useCss()
      .waitForElementVisible('body', 1000)
      .waitForElementPresent('div#topbar', 1000)
      .waitForElementPresent('button#user-register-btn', 1000)

      // CORRECT: Registration as a new user
      // CORRECT: User being redirected to freelancer creation
      .click('button#user-register-btn')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('div#register-form', 1000)
      .assert.visible('input[name=username]')
      .assert.visible('input[name=password]')
      .assert.visible('input[name=confirm-password]')
      .assert.visible('input[name=email]')
      .setValue('input[name=username]', 'nightwatch-user')
      .setValue('input[name=password]', 'test')
      .setValue('input[name=confirm-password]', 'test')
      .setValue('input[name=email]', 'test@night.watch')
      // click "Also create a freelancer profile for myself"
      .click('input[name=register-tick]')
      .click('input[name=submit-button]')
      .waitForElementVisible('body', 1000)
      .waitForElementPresent('div#freelancer-root', 10000)
      .assert.containsText('h1#freelancer-form-title', 'Create your own freelancer profile')

      // // add yourself
      // .url( config.baseURL + '/freelance/new')
      // // test alert if not logged in
      // .click('button#freelancer-myself')
      // .pause(1000)
      // .acceptAlert()
      // // login
      // .setValue('input[name=login-username]', 'Bilbo')
      // .setValue('input[name=login-password]', 'baggins')
      // .click('input[name=login-submit]')
      // .waitForElementPresent('button#freelancer-myself', 2000)
      // .click('button#freelancer-myself')
      // .assert.containsText('h1#freelancer-form-title', 'Create your own freelancer profile')
      // .setValue('input[name=first-name]', 'Bilbo Baggins')
      // .setValue('input[name=job-title]', 'Tester')
      // .click('select[name="category"] option[value="58cc4b15fc13ae5ec7000123"]')
      // .setValue('input[name=address]', 'USI, Lugano')
      // .setValue('input[name=email]', 'test@bilbo.myself')
      // .setValue('input#freelancer-claim-form-files', config.projectRoot + '/README.md')
      // .click('input[name=submit-button]')
      // .pause(2000)
      // .assert.containsText('div#freelancer-claim-status-name', 'IN PROGRESS')
      .end();
  }
};
