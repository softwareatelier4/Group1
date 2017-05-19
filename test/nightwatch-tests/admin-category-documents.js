var config = require('../config');

module.exports = {
  'Admin Category Documents' : function (client) {
    client
      // test login
      .url(config.baseURL + '/admin')
      .useCss()
      .waitForElementPresent('#login-form-username', 10000)
      .waitForElementPresent('#login-form-password', 10000)
      .waitForElementPresent('#login-form-btn', 10000)

      // enter login data and login
      .setValue('input[name=username]', 'admin')
      .setValue('input[name=password]', 'asd')
      .click('button#login-form-btn')

      // check if login was successful
      .waitForElementPresent('body', 10000)
      .pause(1000)
      .assert.containsText('#admin-btn-categories', 'Categories')

      // add a Category
      .setValue('input[name=new-category]', 'Marshmallow')
      .click('button#addCategory')
      .pause(1000)
      .assert.containsText('.card-category:last-child > .card-category-name span', 'Marshmallow')

      // ERROR: category already exists
      .click('button#addCategory')
      .assert.containsText('span#addCategoryError', 'Chosen category name already exists')

      // ERROR: no category name given
      .clearValue('input[name=new-category]')
      .click('button#addCategory')
      .assert.containsText('span#addCategoryError', 'No category name given')

      // add required documents
      .click('.card-category:last-child > .card-category-name > button')
      .setValue('.card-category:last-child input[id=new-document-name]', 'sweet')
      .click('.card-category:last-child input#new-document-required')
      .click('.card-category:last-child button.add-document-btn')
      .click('.card-category:last-child > .card-category-name > button')







      .end();
  }
};
