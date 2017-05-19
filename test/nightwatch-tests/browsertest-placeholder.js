'use strict';
var config = require('../config');

module.exports = {
  'Browser placeholder test: ' : function (client) {
    client
      .url(config.baseURL)
      .waitForElementVisible('body', 1000)
      .end();
  }
};
