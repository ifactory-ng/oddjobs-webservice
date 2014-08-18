var express = require('express');
var router = express.Router();
var schema = require('../conf/schema');
var User = schema.userModel;
var mongoose = require('mongoose');
var Product = schema.productModel;



router.post('/search', function(req, res){
	Product.search({ query: req.body.item, fuzziness: 0.7 }, function(err, results){
		if(err){
			console.log(err);
		}
	return res.json(200, results);
	});
});
module.exports = router;