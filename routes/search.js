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
	      index: _choice,
	      type:'document',
        body: {
            "query": {
                "multi_match": {
                    "query": req.query.q,
                    "fields": [ "name", "about", "location" ]
                }
            }
        }
    }).then(function (resp) {
        var hits = resp.hits.hits;
        res.render('search', { result: hits});
    }, function (err) {
        console.trace(err.message);
        res.render('search', { result: err.message });
  });
});
module.exports = router;