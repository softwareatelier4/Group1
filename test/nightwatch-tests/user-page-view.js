'use strict';
var config = require('../config');

module.exports = {
  'User Page View' : function (client) {
    client
    .url( config.baseURL + '/')
    .useCss()
    .waitForElementVisible('body', 1000)
    .waitForElementVisible('div#topbar', 1000)
    .waitForElementVisible('div#react-login', 3000)
    .setValue('input[name=login-username]', 'Dolben')
    .setValue('input[name=login-password]', 'fooly')
    .click('input[name=login-submit]')
    .pause(1000)
    .waitForElementVisible('div#react-username a', 3000)
    .click('div#react-username a')
    .pause(1000)

    // My own profile
    .waitForElementVisible('body', 1000)
    .waitForElementVisible('h1#user-page-title', 1000)
    .assert.containsText('h1#user-page-title', 'Freelancer profiles owned by you')
    .waitForElementVisible('div.freelancer-card', 1000)
    .assert.containsText('h1.job-title', 'Desktop Support Technician')
    .assert.containsText('div.freelancer-card-info > h2', 'Michael Williamson')

    // Someone else's profile
    .url( config.baseURL + '/user/Robb Bis')
    .waitForElementVisible('body', 1000)
    .waitForElementVisible('h1#user-page-title', 1000)
    .assert.containsText('h1#user-page-title', 'Freelancer profiles owned by Robb Bis')
    .waitForElementVisible('div.freelancer-card', 1000)
    .getAttribute('h1.job-title', 'data-job-title', function(jobTitle) {
      client.getAttribute('div.freelancer-card-info > h2', 'data-name', function(name) {
        client.assert.ok((jobTitle.value === 'Pharmacist' && name.value === 'Fred Carter')
        || (jobTitle.value === 'VP Marketing' && name.value === 'Irene Larson'));
      })
    })

    // Back to my own profile, click "edit"
    .waitForElementVisible('div#react-username a', 3000)
    .click('div#react-username a')
    .pause(1000)
    .moveToElement('div.freelancer-card-container', 0, 0)
    .pause(1000)
    .assert.visible('button.freelancer-edit')
    .click('button.freelancer-edit')
    .pause(1000)
    .waitForElementVisible('body', 1000)
    .assert.containsText('div#root > h3:first-child', 'Edit profile of Michael Williamson (Desktop Support Technician):')

    // Back to my own profile, click "delete"
    .waitForElementVisible('div#react-username a', 3000)
    .click('div#react-username a')
    .pause(1000)
    .moveToElement('div.freelancer-card-container', 0, 0)
    .pause(1000)
    .assert.visible('button.freelancer-delete')
    .click('button.freelancer-delete')
    .acceptAlert()
    .pause(1000)
    .assert.elementNotPresent('div.freelancer-card-container')

    .end();
  }
};
