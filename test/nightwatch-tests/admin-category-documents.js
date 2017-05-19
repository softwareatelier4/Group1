var config = require('../config');

module.exports = {
  'Admin Category Documents' : function (client) {
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

      // check if login was successful
      .waitForElementPresent('body', 10000)
      .pause(5000)
      .assert.containsText('#admin-btn-categories', 'Categories')



      .end();
  }
};
