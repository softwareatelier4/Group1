var config = require('../config');

module.exports = {
  'Login' : function (client) {
    client
      // test homepage
      .url(config.baseURL + '/')
      .useCss()
      .waitForElementVisible('body', 1000)
      .waitForElementPresent('div#react-login', 3000)
      .setValue('input[name=login-username]', 'MrSatan')
      .setValue('input[name=login-password]', '666')
      .click('input[name=login-submit]')
      .waitForElementPresent('div#react-logout', 3000)
      .click('button#freelancer-logout-btn')
      .waitForElementPresent('div#react-login', 3000)
      // test freelancer creation
      .url( config.baseURL + '/freelance/new')
      .useCss()
      .waitForElementVisible('body', 1000)
      .waitForElementPresent('div#react-login', 3000)
      .setValue('input[name=login-username]', 'MrSatan')
      .setValue('input[name=login-password]', '666')
      .click('input[name=login-submit]')
      .waitForElementPresent('div#react-logout', 3000)
      .click('button#freelancer-logout-btn')
      .waitForElementPresent('div#react-login', 3000)
      // test freelancer profile
      .url( config.baseURL + '/freelance/58cc4941fc13ae612c00000e')
      .useCss()
      .waitForElementVisible('body', 1000)
      .waitForElementPresent('div#react-login', 3000)
      .setValue('input[name=login-username]', 'MrSatan')
      .setValue('input[name=login-password]', '666')
      .click('input[name=login-submit]')
      .waitForElementPresent('div#react-logout', 3000)
      .click('button#freelancer-logout-btn')
      .waitForElementPresent('div#react-login', 3000)
      .end();
  }
};
