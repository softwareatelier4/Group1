'use strict';
var config = require('../config');

module.exports = {
  'User Page View' : function (client) {
    client
    .useCss()

    // Someone else's profile
    .url( config.baseURL + '/user/Robb Bis')
    .waitForElementVisible('body', 1000)
    .waitForElementVisible('h1#user-page-title', 1000)
    .assert.containsText('h1#user-page-title', 'Freelancer profiles owned by Robb Bis')
    .waitForElementVisible('div.freelancer-card', 1000)
    .assert.containsText('h1.job-title', 'Graphic Designer')
    
    // Login to see my user page
    .url( config.baseURL + '/')
    .waitForElementVisible('body', 1000)
    .waitForElementPresent('div#topbar', 1000)
    .waitForElementPresent('div#react-login', 3000)
    .setValue('input[name=login-username]', 'Robb Bis')
    .setValue('input[name=login-password]', 'perdonamierastil')
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
    
    .end();
  }
};
