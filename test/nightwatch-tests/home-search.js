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
      .waitForElementVisible('div#freelancers-container', 10000)
      .waitForElementVisible('div.freelancer-card', 1000)
      .pause(5000)
      .getAttribute('div.freelancer-card:first-child', 'data-distance', function(distance) {
        // test non infinite value
        client.assert.ok(Number(distance.value) <= Number.MAX_SAFE_INTEGER);
        // test sorting
        client.getAttribute('div.freelancer-card:last-child', 'data-distance', function(maxDistance) {
          client.assert.ok(Number(distance.value) <= Number(maxDistance.value));
        })
      })
      .setValue('input[name=search-where]', 'Milano')
      .click('button#search-btn')
      .pause(10000)
      .waitForElementVisible('body', 10000)
      .waitForElementVisible('div#freelancers-container', 10000)
      .waitForElementVisible('div.freelancer-card', 1000)
      // set distance
      .moveToElement('input[name=filter-distance-temp]',  0,  0)
      .mouseButtonDown(0)
      .mouseButtonUp(0)
      .pause(500)
      .moveToElement('input[name=filter-distance-temp]',  70,  0)
      .mouseButtonDown(0)
      .mouseButtonUp(0)
      .pause(2000)
      .getAttribute('div.freelancer-card:first-child', 'data-distance', function(distance) {
        // test sorting
        client.getAttribute('div.freelancer-card:last-child', 'data-distance', function(maxDistance) {
          client.assert.ok(Number(distance.value) <= Number(maxDistance.value));
          client.getAttribute('input[name=filter-distance-temp]', 'value', function(maxDistanceFilter) {
            // test distance filter
            if(Number(maxDistance.value) <= Number(maxDistanceFilter.value) * 1000) {
              client.assert.visible('div.freelancer-card:last-child')
            } else {
              client.assert.hidden('div.freelancer-card:last-child')
            }
          })
        })
      })
      // increase distance to test duration properly
      .moveToElement('input[name=filter-distance-temp]',  120,  0)
      .mouseButtonDown(0)
      .mouseButtonUp(0)
      .pause(500)
      // set duration
      .moveToElement('input[name=filter-duration-temp]',  0,  0)
      .mouseButtonDown(0)
      .mouseButtonUp(0)
      .pause(500)
      .moveToElement('input[name=filter-duration-temp]',  70,  0)
      .mouseButtonDown(0)
      .mouseButtonUp(0)
      .pause(2000)
      .getAttribute('div.freelancer-card:last-child', 'data-duration', function(maxDuration) {
        client.getAttribute('input[name=filter-duration-temp]','value', function(maxDurationFilter) {
          // test duration filter
          if(Number(maxDuration.value) <= Number(maxDurationFilter.value) * 60) {
            client.assert.visible('div.freelancer-card:last-child')
          } else {
            client.assert.hidden('div.freelancer-card:last-child')
          }
        })
      })
      .getAttribute('span.category', 'data-category', function(categoryID) {
        client.getText('span.category', function(text) {
          client.click('select[name=filter-category-dropdown] option[id=category-' + categoryID.value + ']');
          client.click('div.freelancer-card')
          client.waitForElementVisible('body', 1000)
          client.waitForElementVisible('span.freelancer-header-title', 1000)
          client.assert.containsText('span.freelancer-header-title', 'VP')
          client.assert.containsText('span.freelancer-category', text.value)
        })
      })
      .end();
  }
};
