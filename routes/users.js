var schema = require('../conf/schema');
var User = schema.userModel;
var Shop = schema.shopModel;
exports.user = function(req, res){
	var id = req.params.id;
	User.findOne({authid: id}, function(err, user){
		if (err){
			console.log(err);
		}
		res.json(200, user);
	});
	
};

exports.about = function(req, res){
	var obj = req.body.about;
	User.findByIdAndUpdate(req.session.passport.user, {
		$set: obj
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
	Shop.owner_id = req.session.passport.user;
	Shop.save;
	};
