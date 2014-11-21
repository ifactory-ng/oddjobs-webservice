var express = require('express');
var router = express.Router();
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


router.get('/search', function(req, res){
client.search({
	      index: 'search_item',
	      type:'document',
        body: {
            "query": {
                "multi_match": {
                    "query": req.query.q,
                    "fields": [ "name", "about", "location", "tag_name", "description", "category"]
                }
            }
        }
    }).then(function (resp) {
        var hits = resp.hits.hits;
       res.json(hits);
    }, function (err) {
        console.trace(err.message);
       res.send(500);
  });
});
module.exports = router;