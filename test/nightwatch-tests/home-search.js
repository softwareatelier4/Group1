var config = require('../config');

module.exports = {
  'Simple search' : function (client) {
    client
      .url( config.baseURL + '/')
      .useCss()
      .waitForElementVisible('body', 1000)
      .pause(10000)
      .waitForElementPresent('input[name=search-what]', 10000)
      .setValue('input[name=search-what]', 'VP')
      .waitForElementPresent('input[name=search-where]', 10000)
      .setValue('input[name=search-where]', 'Milano')
      .click('button#search-btn')
      .pause(10000)
      .waitForElementVisible('body', 10000)
      .waitForElementVisible('div#freelancers-container', 10000)
      .waitForElementVisible('div.freelancer-card', 1000)
      .getAttribute('div.freelancer-card:first-child', 'data-distance', function(distance) {
        // test sorting and distance filtering
        client.getAttribute('div.freelancer-card:last-child', 'data-distance', function(maxDistance) {
          client.assert.ok(Number(distance.value) <= Number(maxDistance.value));
          //client.assert.ok(Number(maxDistance.value) <= 150000);
        })
      })
      .click('div.freelancer-card')
      .waitForElementVisible('body', 1000)
      .waitForElementVisible('span.freelancer-header-title', 1000)
      .assert.containsText('span.freelancer-header-title', 'VP')
      .end();
  }
};
