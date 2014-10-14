var express = require('express');
var router = express.Router();
var schema = require('../conf/schema');
var User = schema.userModel;
var mongoose = require('mongoose');
var elasticsearch = require('elasticsearch');
var Product = schema.productModel;
var connection = process.env.SEARCHBOX_URL || '9200';
var client = new elasticsearch.Client({
	host:connection
});

router.get('/search', function(req, res){
	client.search({
		index: 'Products',
		type: 'document',
		body:{
			query:{
				query_string:{
					query: req.query.q
				}
			}
}}).then(function(resp){
	console.log(resp);
}, function(err){
	
});
});
module.exports = router;