'use strict';

var path = require('path')
module.exports={
  // Paths
  baseURL : 'http://127.0.0.1:3001',
  projectRoot : path.resolve(__dirname, '..'),
  // MongoDB
  // Url of the Mongodb server
  mongoUrl: "mongodb://localhost/",
  // Database name
  mongoDbName: "jobadvisor-dev"
}
