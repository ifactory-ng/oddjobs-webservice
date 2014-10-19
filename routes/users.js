var express = require('express');
var router = express.Router();
var schema = require('../conf/schema');
var user = schema.userModel;
var mongoose = require('mongoose');
var Product = schema.productModel;
//var switcher = require('../conf/my_middle');



/*exports.req.user = function(req, res){
	var id = req.params.id;
	req.user.findOne({authid: id}, function(err, req.user){
		if (err){
			console.log(err);
		}
		res.json(200, req.user);
	});
	
};*/

router.param('user_id', function(req, res, next, id){
	user.findOne({authId: id}, function(err, user){
		if(err) {return next(err);}
		req.user = user._id;
		next();
	});
});
/*var id = function switcher(){
	if(req.session.passport.req.user){
		return req.session.passport.req.user;
	}
	else{
		return req.req.user._id;
	}
};*/

router.put('/profile/update/about/:user_id?',   function(req, res, next){
	var obj = req.body.about;
	console.log(req.body);
console.log("the" + obj);
console.log(req.user);
	user.findByIdAndUpdate(req.user, {
		"about": obj }, function(err, obj){
		if(err){
			console.log("bad credentials");
		next(err);
			}
	return res.json(200, obj);
	});
});

router.post('/profile/create/shop/:user_id?',   function(req, res){
	user.update({_id: req.user}, {
		"shop_name": req.body.shopName}, function(err, obj){
		if(err){
			console.log("bad credentials");
		next(err);
			
		}
		return res.json(200, obj);
	});
	});

router.post('/profile/Product/:user_id?',   function(req, res){
	var products = new Product({
	"tag_name": req.body.tag,
	"description": req.body.desc,
	"category": req.body.category,
"price": req.body.price,
"user_id": req.user
	});
	products.save(function(err){
		if(err){
			console.log(err);
			return res.send(500);
		}
		return res.json(200, products);
	});
});

router.put('/profile/edit/contact_info/:user_id?',   function(req, res){
	
req.user.update({"_id":req.user}, {$push:{ "contacts_info":req.body.contact_info}}, function(err, data){
	if(err){
		console.log(err);
		return res.send(500);
	}
return res.json(200,data);
});
});

router.post('/public/:product_id/comment', function(req, res){
	var comment = req.body.comment;
	Product.update({"product_id": req.params.product_id}, {$push: {"comments": {"name": req.body.name, "email": req.body.email, "comment": req.body.comment, "rating": req.body.rate}}},
		function(err, product){
			if(err){
				console.log("error updating product");
				res.send(500);
				return;
			}
		return res.json(200, product);
			
		});
	});
	
	router.get('/profile/products/:user_id?',   function(req, res){
		Product.find({user_id:req.user}, function(err, result){
			if(err){
				console.log(err);
				res.send(500);
			}
			return res.json(200, result);
		});
	});
	
	router.get('/profile/product/:product_id', function(req, res){
		Product.findOne({product_id: req.params.product_id},  function(err, result){
			if(err){
			console.log("error processing report");
			return res.send(500);
				}
				return res.json(200, result);
		});
	});


module.exports = router;