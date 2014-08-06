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
function switcher(){
	if(req.session.passport.user){
		return req.session.passport.user;
	}
	else{
		return req.user.authId;
	}
}
exports.about = function(req, res){
	var obj = req.body.about;
	var userid;
	if(req.session.passport.user){
		userid = req.session.passport.user;
	}
	else{
		userid = req.user.authId;
	}
	User.update({authId:userid}, {
		about: obj
	}, function(err, obj){
		if(err){
			console.log("bad credentials");
		next(err);
			
		}
		res.json(200, obj);
	}
);
};


exports.createShop = function(req, res){
	var data = req.body.shopName;
	Shop.shop_name = data;
	Shop.owner_id = switcher;
	Shop.save;
	};

exports.addProduct = function(req, res){
	var user = switcher;
	Shop.update({owner_id:user}, {$push: { product: [ {tag_name: req.body.tag}, {description: req.body.desc}, {category: req.body.category}, {price: req.body.price} ] } });
};

exports.contactInfo = function(req, res){
	var user = switcher;
	User.update({authId:user}, {$push:{ contacts_info:req.body.contact_info}});
};
