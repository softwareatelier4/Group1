'use strict';
var config = require('../config');

module.exports = {
  'Freelancer Emergency Edit View' : function (client) {
    client
      .url(config.baseURL + '/')
      .useCss()
      .waitForElementVisible('body', 1000)
      .waitForElementPresent('div#react-login', 3000)
      .setValue('input[name=login-username]', 'Robb Bis')
      .setValue('input[name=login-password]', 'perdonamierastil')
      .click('input[name=login-submit]')
      .waitForElementPresent('#react-username > a', 3000)
      .click('#react-username > a')
      .pause(500)
      .waitForElementPresent('div.freelancer-card', 1000)
      .click('div.freelancer-card')
      .pause(500)
      .waitForElementPresent('button#freelancer-edit-button', 1000)
      .click('button#freelancer-edit-button')
      .pause(500)
      .waitForElementPresent('#edit-btn-schedule', 1000)
      .click('#edit-btn-schedule')
      .pause(500)
      // input single date normal
      .assert.visible('input[id=emergency-single-date]')
      .assert.visible('input[id=emergency-single-start]')
      .assert.visible('input[id=emergency-single-end]')
      .assert.visible('input[id=emergency-location-single]')
      // start: now() + 5min
      .setValue('input[id=emergency-single-start]', function toTimeString(date) {
        date.setMinutes(date.getMinutes() + 5);
      	return ((date.getHours() < 10) ? "0" : "") + date.getHours() + ":" + ((date.getMinutes() < 10) ? "0" : "") + date.getMinutes();
      }(new Date()) )
      // end: now() + 20min
      .setValue('input[id=emergency-single-end]', function toTimeString(date) {
        date.setMinutes(date.getMinutes() + 20);
      	return ((date.getHours() < 10) ? "0" : "") + date.getHours() + ":" + ((date.getMinutes() < 10) ? "0" : "") + date.getMinutes();
      }(new Date()) )
      .setValue('input[id=emergency-location-single]', 'Milano')
      .click('input#emergency-single-submit')
      .pause(1000)
      .getAttribute('#react-freelancer-edit', 'data-error', function(error) { client.assert.ok(error.value == ''); })

      // input single date same day
      .setValue('input[id=emergency-single-start]', function toTimeString(date) {
        date.setHours(date.getHours() + 1);
      	return ((date.getHours() < 10) ? "0" : "") + date.getHours() + ":" + ((date.getMinutes() < 10) ? "0" : "") + date.getMinutes();
      }(new Date()) )
      .setValue('input[id=emergency-single-end]', function toTimeString(date) {
        date.setHours(date.getHours() + 2);
      	return ((date.getHours() < 10) ? "0" : "") + date.getHours() + ":" + ((date.getMinutes() < 10) ? "0" : "") + date.getMinutes();
      }(new Date()) )
      .setValue('input[id=emergency-location-single]', 'Milano')
      .click('input#emergency-single-submit')
      .pause(1000)
      .getAttribute('#react-freelancer-edit', 'data-error', function(error) { client.assert.ok(error.value == ''); })

      // test repeated dates
      .waitForElementPresent('input[id=emergency-form-recurrence-day]', 1000)
      .assert.visible('input[id=emergency-time-1-start]')
      .assert.visible('input[id=emergency-time-1-end]')
      .assert.visible('input[id=emergency-location-1]')

      // test ERROR empty selection
      .setValue('input[id=emergency-repetition-weeks]', '2')
      .click('input#emergency-repetition-submit')
      .pause(500)
      .getAttribute('#react-freelancer-edit', 'data-error-repetition', function(error) { client.assert.ok(error.value == 'empty'); })

      // test repetition input ok
      .setValue('input[id=emergency-repetition-weeks]', '')
      .click('input#emergency-form-recurrence-day')
      .pause(500)
      .setValue('input[id=emergency-time-1-start]', function toTimeString(date) {
        date.setMinutes(date.getMinutes() + 25);
      	return ((date.getHours() < 10) ? "0" : "") + date.getHours() + ":" + ((date.getMinutes() < 10) ? "0" : "") + date.getMinutes();
      }(new Date()) )
      .setValue('input[id=emergency-time-1-end]', function toTimeString(date) {
        date.setMinutes(date.getMinutes() + 30);
      	return ((date.getHours() < 10) ? "0" : "") + date.getHours() + ":" + ((date.getMinutes() < 10) ? "0" : "") + date.getMinutes();
      }(new Date()) )
      .setValue('input[id=emergency-location-1]', 'Lugano')
      .setValue('input[id=emergency-repetition-weeks]', '4')
      .getAttribute('#react-freelancer-edit', 'data-error-repetition', function(error) { client.assert.ok(error.value == ''); })
      .click('input#emergency-repetition-submit')
      .pause(500)

      // test ERROR conflicting single date
      .setValue('input[id=emergency-single-start]', function toTimeString(date) {
        date.setMinutes(date.getMinutes() + 10);
      	return ((date.getHours() < 10) ? "0" : "") + date.getHours() + ":" + ((date.getMinutes() < 10) ? "0" : "") + date.getMinutes();
      }(new Date()) )
      .setValue('input[id=emergency-single-end]', function toTimeString(date) {
        date.setMinutes(date.getMinutes() + 15);
      	return ((date.getHours() < 10) ? "0" : "") + date.getHours() + ":" + ((date.getMinutes() < 10) ? "0" : "") + date.getMinutes();
      }(new Date()) )
      .setValue('input[id=emergency-location-single]', 'Milano')
      .click('input#emergency-single-submit')
      .pause(500)
      .getAttribute('#react-freelancer-edit', 'data-error', function(error) { client.assert.ok(error.value == 'conflict'); })

      // test ERROR conflicting repeated date
      .click('input#emergency-form-recurrence-day')
      .pause(500)
      .setValue('input[id=emergency-time-1-start]', function toTimeString(date) {
        date.setMinutes(date.getMinutes() + 25);
      	return ((date.getHours() < 10) ? "0" : "") + date.getHours() + ":" + ((date.getMinutes() < 10) ? "0" : "") + date.getMinutes();
      }(new Date()) )
      .setValue('input[id=emergency-time-1-end]', function toTimeString(date) {
        date.setMinutes(date.getMinutes() + 30);
      	return ((date.getHours() < 10) ? "0" : "") + date.getHours() + ":" + ((date.getMinutes() < 10) ? "0" : "") + date.getMinutes();
      }(new Date()) )
      .setValue('input[id=emergency-location-1]', 'Lugano')
      .click('input#emergency-repetition-submit')
      .pause(500)
      .getAttribute('#react-freelancer-edit', 'data-error-repetition', function(error) { client.assert.ok(error.value == 'conflict'); })

      // test ERROR past date
      .setValue('input[id=emergency-single-date]', '')
      .setValue('input[id=emergency-single-end]', '')
      .setValue('input[id=emergency-single-start]', '')
      .setValue('input[id=emergency-location-single]', '')
      .setValue('input[id=emergency-single-start]', function toTimeString(date) {
        date.setMinutes(date.getMinutes() - 1);
      	return ((date.getHours() < 10) ? "0" : "") + date.getHours() + ":" + ((date.getMinutes() < 10) ? "0" : "") + date.getMinutes();
      }(new Date()) )
      .setValue('input[id=emergency-single-end]', function toTimeString(date) {
        date.setMinutes(date.getMinutes() + 2);
      	return ((date.getHours() < 10) ? "0" : "") + date.getHours() + ":" + ((date.getMinutes() < 10) ? "0" : "") + date.getMinutes();
      }(new Date()) )
      .setValue('input[id=emergency-location-single]', 'Milano')
      .click('input#emergency-single-submit')
      .pause(5000)
      .getAttribute('#react-freelancer-edit', 'data-error', function(error) { console.log(error.value);client.assert.ok(error.value == 'past_interval'); })
      .end();
  }
};
