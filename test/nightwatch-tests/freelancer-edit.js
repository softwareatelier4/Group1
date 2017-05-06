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
      .waitForElementPresent('div#react-freelancer-emergency-single-list', 3000)
      // check single dates
      .getAttribute('div#react-freelancer-emergency-single-list > ul > li:last-child', 'data-key', function(key) {
        let lastLiChild = 'div#react-freelancer-emergency-single-list > ul > li:last-child';
        // check 10 single dates loaded
        client.assert.ok(key.value == 9);
        client.getText(lastLiChild, function(lastDate) {
          // delete last date
          client.click(lastLiChild + ' > input');
          client.pause(1000)
          // check date was deleted
          client.getAttribute(lastLiChild, 'data-key', function(secondKey) {
            client.assert.ok(secondKey.value == 8);
            client.getText(lastLiChild, function(secondLastDate) {
              client.assert.ok(lastDate.value != secondLastDate.value)
            });
          });
        });
      })
      .end();
  }
};
