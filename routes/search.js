/*var express = require('express');
var search_route = express.Router();
var schema = require('../conf/schema');
var config = require('../conf/auth');
var User = schema.userModel;
var mongoose = require('mongoose');
var elasticsearch = require('elasticsearch');
var connectionString = 'http://paas:52422704d70bce398fc652bdb0d321d9@bofur-us-east-1.searchly.com';

if (process.env.SEARCHBOX_URL) {
    // Heroku
    connectionString = process.env.SEARCHBOX_URL;
}

var client = new elasticsearch.Client({
    host: connectionString
});


search_route.
module.exports = search_route;
*/