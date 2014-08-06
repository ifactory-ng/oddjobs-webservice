var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var schema = require('./conf/schema');
//var routes = require('./routes/index');
var api = require('./routes/users');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('./conf/auth');

passport.serializeUser(function(user, done) {
done(null, user);
});
passport.deserializeUser(function(obj, done) {
done(null, obj);
});
var User = schema.userModel;

// config
passport.use(new FacebookStrategy({
clientID: config.facebook.clientID,
clientSecret: config.facebook.clientSecret,
callbackURL: config.facebook.callbackURL
},
function(accessToken, refreshToken, profile, done) {
User.findOne({ authID: profile.id }, function(err, user) {
if(err) { console.log(err); }
if (!err && user !== null) {
  done(null, user);
} else {
 
 var User = new User({
	authId: profile.id,
	email: profile.emails[0].value,
	name: profile.displayName,
	created: Date.now()
});
 User.save(function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("saving user ...");
      done(null, user);
    }
  });
}
});
}
));

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
//routing

app.param('user_id', function(req, res, next, id){
	User.find({authId:id}, function(err, user){
		if(err) return next(err);
		if(!user) return next(new Error('failed to find user'));
		req.user = user;
		next();
	});
});
app.get('/auth/facebook',
passport.authenticate('facebook',
{scope: 'email'}), function(req, res){
});


app.get('/auth/facebook/callback',
passport.authenticate('facebook', { failureRedirect: '/' }),
function(req, res) {
 res.redirect('/profile');
});
//profile section
app.get('/profile/:user_id?', function(req, res){
	if(!req.params.id){
	User.find({authId:req.session.passport.user}, function(err, user){
		if(err) {
			console.log(err);
			res.send(500);
		}
		res.json(200, user);
	});
}
	else{
		res.json(200, req.user);
	}
});
//app.get('/profile/:id', api.user);
app.put('/profile/update/about', api.about);
app.put('/profile/edit/contact_info/:user_id?', api.contactInfo);
app.post('/profile/create/shop/:user_id?', api.createShop);
app.post('/profile/shop/addProduct/:user_id?', api.addProduct);

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
