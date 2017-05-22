var config = require('../config');

module.exports = {
  'Admin Claims' : function (client) {
    client
      // test login
      .url(config.baseURL + '/admin')
      .useCss()
      .waitForElementPresent('#login-form-username', 10000)
      .waitForElementPresent('#login-form-password', 10000)
      .waitForElementPresent('#login-form-btn', 10000)

      // enter login data and login
      .setValue('input[name=username]', 'admin')
      .setValue('input[name=password]', 'asd')
      .click('button#login-form-btn')
      .pause(1000)

      // check if login was successful
      .waitForElementPresent('body', 10000)
      .assert.containsText('#admin-btn-categories', 'Categories')

      // move to claims
      .click("button#admin-btn-claims")
      .waitForElementVisible("#admin-claims", 1000)

      // show message box
      .assert.containsText(".card-claim:last-child > div > div:first-child > a", "Robb")
      .click(".card-claim:last-child > div > button:last-child")
      .pause(300)
      .waitForElementPresent(".card-claim:last-child > div:last-child > textarea", 1000)

      // move to duplicates
      .click("button#admin-btn-duplicates")
      .waitForElementVisible("#admin-duplicates", 1000)

      .end();
    }
  };
