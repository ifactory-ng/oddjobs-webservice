var mongoose = require('mongoose');
var mongodbURL = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/oddjobs';
var mongodbOptions = {};

mongoose.connect(mongodbURL, mongodbOptions, function (err, res){
	if(err){
		console.log('Connection refused to ' + mongodbURL);
		console.log(err);
	} else {
		console.log('Connection successful to: ' + mongodbURL);
	}
});

var Schema = mongoose.Schema;

//user schema
var Contacts = new Schema({
	name: String,
	contact_id: String,
	email: String
});

var Comments = new Schema({
name: String,
	email: String,
	comment: String,
	rating: {type: Number, default:0}
});

var User = new Schema({
	authId: Number,
	email: String,
	name: String,
	about: String,
	contacts: [Contacts],
	contact_info: Number
	});
	
	var Product = new Schema({
		tag_name: String,
		description: String,
		category: String,
		comments: [Comments],
		pic: String,
		cost: Number,
		rating: {type: Number, default: 0}
	});
	var Shop = new Schema({
		 owner_id: String,
		 shop_name: String,
		 product: [Product]
	});
	var userModel = mongoose.model('User', User);
	var shopModel = mongoose.model('Shop', Shop);
	
	exports.shopModel = shopModel;
	exports.userModel = userModel;