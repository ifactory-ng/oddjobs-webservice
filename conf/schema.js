var mongoose = require('mongoose');
var mongodbURL = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/oddjobs';
var mongodbOptions = {};
var db = mongoose.connection;
//var connectionString = "http://paas:52422704d70bce398fc652bdb0d321d9@bofur-us-east-1.searchly.com";
db.on('error', console.error);
//var elmongo = require('elmongo');
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
	//contacts: [Contacts],
	created: Number,
	address: String,
	phone: Number,
	location: String
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
		tag_name: {type: String},
		description: {type: String},
		category: {type: String},
		comments: [Comments],
		product_id: Number,
		user_id: String,
		address: String,
		name: String,
		location: {type: String},
		rating: {type: Number}
});

//Product.plugin(elmongo);
//Product.plugin(elmongo, {host: connectionString, port:process.env.PORT});
var products = mongoose.model('Products', Product);

/*products.sync(function (err, numSynced){
	
	console.log('number of search items indexed:', numSynced);
});
*/
var user = mongoose.model('Users', User);
exports.productModel = products;
//var Search = mongoose.model('elastic', Search);
exports.userModel = user;
//shopModel = mongoose.model('Shop', Shop);
