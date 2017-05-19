'use strict';
var config = require('../config');

module.exports = {
  'User Page View' : function (client) {
    client
    .url( config.baseURL + '/')
    .useCss()
    .waitForElementVisible('body', 1000)
    .waitForElementPresent('div#topbar', 1000)
    .waitForElementPresent('div#react-login', 3000)
    .setValue('input[name=login-username]', 'Dolben')
    .setValue('input[name=login-password]', 'fooly')
    .click('input[name=login-submit]')
    .pause(1000)
    .waitForElementPresent('div#react-username a', 3000)
    .click('div#react-username a')
    .pause(1000)

    // My own profile
    .waitForElementVisible('body', 1000)
    .waitForElementVisible('h1#user-page-title', 1000)
    .assert.containsText('h1#user-page-title', 'Freelancer profiles owned by you')
    .waitForElementVisible('div.freelancer-card', 1000)
    .assert.containsText('h1.job-title', 'Recruiting Manager')

    // Someone else's profile
    .url( config.baseURL + '/user/Uial')
    .waitForElementVisible('body', 1000)
    .waitForElementVisible('h1#user-page-title', 1000)
    .assert.containsText('h1#user-page-title', 'Freelancer profiles owned by Uial')
    .waitForElementVisible('div.freelancer-card', 1000)
    .assert.containsText('h1.job-title', 'Graphic Designer')
  }
};
