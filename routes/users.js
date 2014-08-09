var express = require('express');
var router = express.Router();
var schema = require('../conf/schema');
var User = schema.userModel;
var Shop = schema.shopModel;
/*exports.user = function(req, res){
	var id = req.params.id;
	User.findOne({authid: id}, function(err, user){
		if (err){
			console.log(err);
		}
		res.json(200, user);
	});
	
};*/
/*router.param('user', function(req, res, next, id){
	User.find({authId:id}, function(err, user){
		if(err) return next(err);
		if(!user) return next(new Error('failed to find user'));
		req.user = user;
		next();
	});
});
*/
function switcher(){
	if(req.session.passport.user){
		return req.session.passport.user;
	}
	else{
		return req.user.authId;
	}
}

router.put('/profile/update/about/:user_id?', function(req, res){
	var obj = req.body.about;
	var userid = switcher;
	User.update({"authId": "userid"}, {
		"about": "obj"
	}, function(err, obj){
		if(err){
			console.log("bad credentials");
		next(err);
			
		}
		res.json(200, obj);
	}
);
});

router.post('/profile/create/shop/:user_id?', function(req, res){
	var shop = new Shop({
		"shop_name": "req.body.shopName",
		"owner_id": "switcher"
	});
	shop.save;
	res.json(200, shop);
	});

router.post('/profile/shop/addProduct/:user_id?', function(req, res){
	var user = switcher;
	Shop.update({"owner_id":"user"}, {$push: { "product": [ {"tag_name": "req.body.tag"}, {"description": "req.body.desc"}, {"category": "req.body.category"}, {"price": "req.body.price"} ] } });
});

router.put('/profile/edit/contact_info/:user_id?', function(req, res){
	var user = switcher;
	User.update({"authId":"user"}, {$push:{ "contacts_info":"req.body.contact_info"}});
});

router.post('/profile/:product_id/comment', function(req, res){
	var comment = req.body.comment;
	Shop.find({"product.product_id": "req.params.product_id"}, {"product" :{"$elemMatch":{"product_id" : "req.params.product_id"}}},
	function(err, product){
		product.update({"product_id": "req.params.product_id"}, {$push: {"comments": [ {"name": "req.body.name"}, {"email": "req.body.email"}, {"comment": "req.body.comment"}, {"rating": "req.body.rate"} ] } },
		function(err, product){
			if(err){
				console.log("error updating product");
				res.send(500);
				return;
			}
		res.json(200, product);
			
		});
	});
});
module.exports = router;