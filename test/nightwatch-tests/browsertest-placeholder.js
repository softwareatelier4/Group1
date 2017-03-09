module.exports = {
  'Browser placeholder test: ' : function (client) {
    client
      .url('http://localhost:3000/')
      .waitForElementVisible('body', 1000)
      .end();
  }
};
