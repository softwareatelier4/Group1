var config = require('../config');

module.exports = {
  'Freelancer Create View' : function (client) {
    client
      .url( config.baseURL + '/freelance/new')
      .useCss()
      .waitForElementVisible('body', 1000)
      .waitForElementPresent('div#freelancer-root', 10000)
      .assert.visible('input[name=first-name]')
      .assert.visible('input[name=family-name]')
      .assert.visible('input[name=job-title]')
      .assert.visible('select[name="category"]')
      .assert.visible('input[name=address]')
      .assert.visible('input[name=phone]')
      .assert.visible('input[name=email]')
      .clearValue('input[name=first-name]')
      .setValue('input[name=first-name]', 'Nightwatch')
      .setValue('input[name=job-title]', 'Tester')
      .click('select[name="category"] option[value="58cc4b15fc13ae5ec7000123"]')
      .setValue('input[name=address]', 'USI, Lugano')
      .setValue('input[name=email]', 'test@night.watch')
      .click('input[name=submit-button]')
      .waitForElementVisible('div.freelancer-view', 1000)
      .assert.containsText('h1.freelancer-header-name', 'Nightwatch')
      .assert.containsText('span.freelancer-category', 'Engineering')
      .assert.containsText('a.freelancer-address', 'USI, Lugano')
      .assert.containsText('a.freelancer-email', 'test@night.watch')
      .end();
  }
};
