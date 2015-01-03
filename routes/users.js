var express = require('express');
var router = express.Router();
var schema = require('../conf/schema');
var config = require('../conf/auth');
var user = schema.userModel;
var mongoose = require('mongoose');
var Product = schema.productModel;
//var switcher = require('../conf/my_middle');
var es = require('elasticsearch');
var connectionString = 'http://paas:52422704d70bce398fc652bdb0d321d9@bofur-us-east-1.searchly.com';

if (process.env.SEARCHBOX_URL) {
    // Heroku
    connectionString = process.env.SEARCHBOX_URL;
		console.info(connectionString);
	
}



var client = new es.Client({
    host: connectionString
});

router.param('user_id', function(req, res, next, id){
	user.findOne({authId: id}, function(err, user){
		if(err) {return next(err);}
		req.user = user;
		next();
	});
});

/*exports.req.user = function(req, res){
	var id = req.params.id;
	req.user.findOne({authid: id}, function(err, req.user){
		if (err){
			console.log(err);
		}
		res.json(200, req.user);
	});
	
};*/

/*var id = function switcher(){
	if(req.session.passport.req.user){
		return req.session.passport.req.user;
	}
	else{
		return req.req.user._id;
	}
};*/

router.post('/profile/authenticate', function(req, res){
	//var users = '';
	var profile = req.body;
	console.log(profile);
	user.find({ authId: profile.id }, function(err, user) {
if(err) { console.log(err); }
if (!err && user !== null) {
  return res.send(200);
} else {
 
   var users = new user({
  	authId: req.body.id,
	  email: profile.email,
	 name: profile.name,
	 gender: profile.gender,
	 created: Date.now()
});
 users.save(function(err, User) {
    if(err) {
     return console.log(err);
    } else {
      console.log("saving user ...");
      return res.send(200);
    	
    }
  });
}
});
});


router.put('/profile/update/details/:user_id?',   function(req, res, next){
	var obj = req.body;
	console.log(req.body[0]);
	console.log(req.body.User);
console.log("the" + obj);
console.log(req.user);



	user.findByIdAndUpdate(req.user._id, {
		"about": obj.about, "address": obj.address, "phone": obj.phone, "location": obj.location}, function(err, obj){
		if(err){
			console.log("bad credentials");
		next(err);
			}
			client.indices.create({index: "search_item"}, function (error, response) {
        client.bulk({
            body: [
                // action description
                { "index": { "_index": "search_item", "_type": "document", "_id": req.user.id} },
                {'about': obj.about, 'address': obj.address, 'phone': obj.phone, 'location': obj.location}
            ]
        }, function (err, resp) {
            return res.send(200);
        });
    });
});
	});
router.get('/profile/:user_id?', function(req, res){
	return res.json(200, req.user);
});

router.post('/profile/Product/:user_id?',   function(req, res){
	var products = new Product({
	"tag_name": req.body.tag,
	"description": req.body.desc,
	"category": req.body.category,
"price": req.body.price,
"user_id": req.user.authId,
"name" : req.user.name,
"location" : req.body.location,
"address": req.body.address
	});
	 
	products.save(function(err, data){
		if(err){
			console.log(err);
			return res.send(500);
		}
	client.indices.create({index: "search_items"}, function (error, response){
client.bulk({body: [
                { "index": { "_index": "search_item", "_type": "document", "_id": data._id} },
                {'tag_name': req.body.tag, 'description': req.body.desc, 'category': req.body.category}
]});
  // ...
  
});
		return res.json(200, products);
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
		Product.find({user_id:req.user.authId}, function(err, result){
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

router.get('/profile/:prooduct_id/comment', function(req, res){
	Product.findOne({product_id: req.params.product_id}, function(err, result){
		if(err){
			console.log(err);
		return res.send(500);
			
		}
		return res.json(200, result);
	});
});

module.exports = router;