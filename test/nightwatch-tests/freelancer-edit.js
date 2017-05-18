'use strict';
var config = require('../config');

module.exports = {
  'Freelancer Emergency Edit View' : function (client) {
    client
      .url( config.baseURL + '/')
      .useCss()
      .waitForElementVisible('body', 1000)
      .waitForElementPresent('div#react-login', 3000)
      .setValue('input[name=login-username]', 'Uial')
      .setValue('input[name=login-password]', 'fooly')
      .click('input[name=login-submit]')
      .waitForElementPresent('a#emergency-edit-link', 3000)
      .click('a#emergency-edit-link')
      .waitForElementPresent('div#react-freelancer-edit', 3000)
      .end();
  }
};
