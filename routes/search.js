var express = require('express');
var router = express.Router();
var schema = require('../conf/schema');
var User = schema.userModel;
var mongoose = require('mongoose');
var Product = schema.productModel;



router.get('/search', function(req, res){
	Product.search({ query: req.query.q, fuzziness: 0.5}, function(err, results){
	 client.search({
        index: user,
        type: mytype,
        body: {
            "query": {
                "multi_match": {
                    "query": req.query.q,
                    "fields": [ "name", "text" ]
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
});
module.exports = router;