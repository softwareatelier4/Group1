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
      // CORRECT: User being logged in after registration
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
      .waitForElementPresent('div#topbar', 1000)
      .assert.containsText('div#react-username', 'nightwatch-user')
      .waitForElementPresent('div#freelancer-root', 10000)
      .assert.containsText('h1#freelancer-form-title', 'Create your own freelancer profile')
      // logout
      .click('button#freelancer-logout-btn')
      .waitForElementVisible('body', 1000)
      .waitForElementPresent('div#topbar', 1000)
      .waitForElementPresent('button#user-register-btn', 1000)

      // CORRECT: User being redirected to home when the tick is not ticked
      .click('button#user-register-btn')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('div#register-form', 1000)
      .assert.visible('input[name=username]')
      .assert.visible('input[name=password]')
      .assert.visible('input[name=confirm-password]')
      .assert.visible('input[name=email]')
      .setValue('input[name=username]', 'nightwatch-user2')
      .setValue('input[name=password]', 'test')
      .setValue('input[name=confirm-password]', 'test')
      .setValue('input[name=email]', 'test@night.watch')
      // do not click "Also create a freelancer profile for myself"
      .click('input[name=submit-button]')
      .waitForElementVisible('body', 1000)
      .waitForElementPresent('div#topbar', 1000)
      .assert.containsText('div#react-username', 'nightwatch-user2')
      .waitForElementPresent('div#react-search-container', 10000)
      .assert.visible('input[name=search-what]')
      .assert.visible('input[name=search-where]')
      // logout
      .click('button#freelancer-logout-btn')
      .waitForElementVisible('body', 1000)
      .waitForElementPresent('div#topbar', 1000)
      .waitForElementPresent('button#user-register-btn', 1000)

      // ERROR: Registration with an already used username
      .click('button#user-register-btn')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('div#register-form', 1000)
      .assert.visible('input[name=username]')
      .assert.visible('input[name=password]')
      .assert.visible('input[name=confirm-password]')
      .assert.visible('input[name=email]')
      .setValue('input[name=username]', 'nightwatch-user2')
      .setValue('input[name=password]', 'test')
      .setValue('input[name=confirm-password]', 'test')
      .setValue('input[name=email]', 'test@night.watch')
      .click('input[name=submit-button]')
      // should still be on register form
      .assert.visible('div#register-form')
      .end();
  }
};
