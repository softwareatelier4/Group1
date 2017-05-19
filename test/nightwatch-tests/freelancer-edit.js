'use strict';
var config = require('../config');

module.exports = {
  'Freelancer Emergency Edit View' : function (client) {
    client
      .url( config.baseURL + '/')
      .useCss()
      .waitForElementVisible('body', 1000)
      .waitForElementPresent('div#react-login', 3000)
      .setValue('input[name=login-username]', 'Robb Bis')
      .setValue('input[name=login-password]', 'perdonamierastil')
      .click('input[name=login-submit]')
      .waitForElementPresent('a#emergency-edit-link', 3000)
      .click('a#emergency-edit-link')
      .waitForElementPresent('div#react-freelancer-edit', 3000)
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
      .assert.containsText('span#emergency-date-error', '')

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
      .assert.containsText('span#emergency-date-error', '')

      // test repeated dates
      .assert.visible('input[id=emergency-form-recurrence-day]')
      .assert.visible('input[id=emergency-time-1-start]')
      .assert.visible('input[id=emergency-time-1-end]')
      .assert.visible('input[id=emergency-location-1]')

      // test ERROR empty selection
      .setValue('input[id=emergency-repetition-weeks]', '2')
      .click('input#emergency-repetition-submit')
      .pause(500)
      .assert.containsText('span#emergency-date-error', 'Schedule at least one day')
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
      .click('input#emergency-repetition-submit')
      .pause(500)
      .assert.containsText('span#emergency-date-error', '')

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
      .assert.containsText('span#emergency-date-error', 'Date conflicts with existing one')

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
      .assert.containsText('span#emergency-date-error', 'conflicts with existing dates and was not saved')

      // test ERROR past date
      .setValue('input[id=emergency-single-date]', '')
      .setValue('input[id=emergency-single-end]', '')
      .setValue('input[id=emergency-single-start]', '')
      .setValue('input[id=emergency-location-single]', '')
      .setValue('input[id=emergency-single-start]', function toTimeString(date) {
        date.setMinutes(date.getMinutes());
      	return ((date.getHours() < 10) ? "0" : "") + date.getHours() + ":" + ((date.getMinutes() < 10) ? "0" : "") + date.getMinutes();
      }(new Date()) )
      .setValue('input[id=emergency-single-end]', function toTimeString(date) {
        date.setMinutes(date.getMinutes() + 2);
      	return ((date.getHours() < 10) ? "0" : "") + date.getHours() + ":" + ((date.getMinutes() < 10) ? "0" : "") + date.getMinutes();
      }(new Date()) )
      .setValue('input[id=emergency-location-single]', 'Milano')
      .click('input#emergency-single-submit')
      .assert.containsText('span#emergency-date-error', 'Past dates are not valid')
      .end();
  }
};
