var mongoose = require('mongoose');
var mongodbURL = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/oddjobs';
var mongodbOptions = {};
var db = mongoose.connection;
db.on('error', console.error);
mongoose.connect(mongodbURL, mongodbOptions, function (err, res){
	if(err){
		console.log('Connection refused to ' + mongodbURL);
		console.log(err);
	} else {
		console.log('Connection successful to: ' + mongodbURL);
	}
});

//user schema
var Contacts = mongoose.model('Contacts', {
	name: String,
	contact_id: String,
	email: String
});

var Comments = mongoose.model( 'Comments', {
name: String,
	email: String,
	comment: String,
	rating: {type: Number, default:0}
});

var User = mongoose.model('User',{
	authId: String,
	email: String,
	name: String,
	about: String,
	contacts: [Contacts],
	created: Number,
	contact_info: Number
	});
	
	var Product = mongoose.model('Products',{
		tag_name: String,
		description: String,
		category: String,
		comments: [Comments],
		pic: String,
		cost: Number,
		product_id: Number,
		rating: {type: Number, default: 0}
	});
	var Shop = mongoose.model('Shop',{
		 owner_id: String,
		 shop_name: String,
		 product: [Product]
	});
//	userModel = mongoose.model('User', User);
//shopModel = mongoose.model('Shop', Shop);
	
	exports.shopModel = Shop;
	exports.userModel = User;