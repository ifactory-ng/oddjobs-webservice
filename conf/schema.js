var mongoose = require('mongoose');
var mongodbURL = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/oddjobs';
var mongodbOptions = {};
var db = mongoose.connection;
db.on('error', console.error);
var elmongo = require('elmongo');
var Schema = mongoose.Schema;
mongoose.set('debug', true);
mongoose.connect(mongodbURL, mongodbOptions, function (err, res){
	if(err){
		console.log('Connection refused to ' + mongodbURL);
		console.log(err);
	} else {
		console.log('Connection successful to: ' + mongodbURL);
	}
});
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
	authId: String,
	email: String,
	name: String,
	about: String,
	contacts: [Contacts],
	created: Number,
	shop_name: String,
	contact_info: Number
	});
	
	/*var Product = mongoose.model('Products',{
		tag_name: String,
		description: String,
		category: String,
		comments: [Comments],
		pic: String,
		cost: Number,
		product_id: Number,
		user_id: String,
		location: String,
		rating: {type: Number, default: 0}
	});*/
	
	
	
	var Product = new Schema({
		tag_name: {type: String, autocomplete:true},
		description: {type: String},
		category: {type: String, autocomplete:true},
		comments: [Comments],
		pic: String,
		cost: Number,
		product_id: Number,
		user_id: String,
		location: {type: String, autocomplete:true},
		rating: {type: Number, default: 0}
});

//Product.plugin(elmongo);
Product.plugin(elmongo, { host: process.env.SEARCHBOX_URL || 'localhost', port: 9200});
var products = mongoose.model('Products', Product);

products.sync(function (err, numSynced){
	
	console.log('number of search items indexed:', numSynced);
});

exports.productModel = products;
//var Search = mongoose.model('elastic', Search);
exports.userModel = mongoose.model('Users', User);
//shopModel = mongoose.model('Shop', Shop);
