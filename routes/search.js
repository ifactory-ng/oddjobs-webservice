var express = require('express');
var router = express.Router();
var schema = require('../conf/schema');
var User = schema.userModel;
var mongoose = require('mongoose');
var elasticsearch = require('elasticsearch');
var connectionString = 'https://site:your-key@xyz.searchly.com';

if (process.env.SEARCHBOX_URL) {
    // Heroku
    connectionString = process.env.SEARCHBOX_URL;
} else if (process.env.SEARCHBOX_URL) {
    // CloudControl, Modulus
    connectionString = process.env.SEARCHLY_URL;
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