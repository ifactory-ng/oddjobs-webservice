var express = require('express');
var router = express.Router();
var schema = require('../conf/schema');
var User = schema.userModel;
var mongoose = require('mongoose');
var Product = schema.productModel;

Product.sync(function (err, numSynced){
	console.log('number of search items indexed:', numSynced);
});

router.get('/search', function(req, res){
	Product.search({ query: req.body.item}, function(err, results){
		if(err){
			console.log(err);
		}
		if(result === null){
			
		}
		res.json(200, results);
	});
});