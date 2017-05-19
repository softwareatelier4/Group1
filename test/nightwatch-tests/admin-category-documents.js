var config = require('../config');

module.exports = {
  'Admin Category Documents' : function (client) {
    client
      // test login
      .url(config.baseURL + '/admin')
      .useCss()


      .end();
  }
};
