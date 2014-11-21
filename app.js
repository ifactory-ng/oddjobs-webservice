var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var schema = require('./conf/schema');
//var routes = require('./routes/index');
var api = require('./routes/users');
var config = require('./conf/auth');
var routes = require('./routes/index');
var route = require('./routes/users');
var search = require('./routes/search');
var mongoose = require('mongoose');
var session = require('express-session');
var es = require('elasticsearch');
var Users = schema.userModel;

var connectionString = 'https://site:your-key@xyz.searchly.com';

if (process.env.SEARCHBOX_URL) {
    // Heroku
    connectionString = process.env.SEARCHBOX_URL;
} else if (process.env.SEARCHBOX_URL) {
    // CloudControl, Modulus
    connectionString = process.env.SEARCHLY_URL;
} else if (process.env.VCAP_SERVICES) {
    // Pivotal, Openshift
    connectionString = JSON.parse(process.env.VCAP_SERVICES)['searchly-n/a'][0].credentials.uri;
}

console.info(connectionString);

var client = new es.Client({
    host: connectionString
});

/*var Users = mongoose.model('Users', {
  oauthID: Number,
  name: String,
  email: String
});
*/

// config
/*passport.use(new FacebookStrategy({
clientID: config.facebook.clientID,
clientSecret: config.facebook.clientSecret,
callbackURL: config.facebook.callbackURL
},
function(accessToken, refreshToken, profile, done) {

}
));
*/


var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({ secret: 'odd', cookie: { maxAge: 60000 }}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');

        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        next();
    }
);

//routing
app.use('/', routes);
app.use('/', route);
app.use('/', search);


/*passport.serializeUser(function(user, done) {
done(null, user._id);
});
passport.deserializeUser(function(id, done) {
 Users.findById(id, function(err, user){
     console.log(user);
     if(!err) done(null, user);
     else done(err, null);
 });
});
*/

app.param('user_id', function(req, res, next, id){
	Users.findOne({authId: id}, function(err, user){
		if(err) {return next(err);}
		req.user = user;
		next();
	});
});

app.post('/authenticate', function(req, res){
	var users = '';
	var profile = req.body;
Users.findOne({ authId: profile.userID }, function(err, user) {
if(err) { console.log(err); }
if (!err && user !== null) {
  return res.send(200);
} else {
 
   users = new Users({
  	authId: req.body.userID,
	  email: profile.email,
	 name: profile.name,
	 created: Date.now()
});
	 
	 client.create({index: "search_item", type: 'document',
  id: profile.userID,
  body: users
}, function (error, response) {
  // ...
  
}); users.save(function(err, User) {
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
//profile section
app.get('/profile/:user_id?', function(req, res){
	
		return res.json(200, req.user);
});


/*app.get('/test', function(req, res){
	console.log(req.query.test);
});*/
//app.get('/profile/:id', api.user);


/*function ensureAuthenticated(req, res, next){
	if (req.isAuthenticated()) { return next(); }
	res.send(500);
}*/
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development' || 'production') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(process.env.PORT || 3000);
module.exports = app;
