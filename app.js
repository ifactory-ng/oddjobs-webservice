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
var routes = require('./routes/index');
var mongoose = require('mongoose');
var session = require('express-session');
GoogleStrategy = require('passport-google').Strategy;

var Users = schema.userModel;
/*var Users = mongoose.model('Users', {
  oauthID: Number,
  name: String,
  email: String
});
*/

// config
passport.use(new FacebookStrategy({
clientID: config.facebook.clientID,
clientSecret: config.facebook.clientSecret,
callbackURL: config.facebook.callbackURL
},
function(accessToken, refreshToken, profile, done) {
Users.findOne({ authId: profile.id }, function(err, user) {
if(err) { console.log(err); }
if (!err && user !== null) {
  done(null, user);
} else {
 
  var users = new Users({
  authId: profile.id,
	 email: profile.emails[0].value,
	 name: profile.displayName,
	 created: Date.now()
});
	 
 users.save(function(err, User) {
    if(err) {
     return console.log(err);
    } else {
      console.log("saving user ...");
      done(null, users);
    }
  });
}
});
}
));

passport.use(new GoogleStrategy({
    returnURL: 'http://localhost:3000/auth/google/return',
    realm: 'http://localhost:3000/'
  },
  function(profile, done) {
    Users.findOne({ authId: profile}, function(err, user) {
       if(err) { console.log(err); }
if (!err && user !== null) {
  done(null, user);
} else {
 
  var users = new Users({
  authId: profile.id,
	 //email: profile.emails[0].value,
	 name: profile.displayName,
	 created: Date.now()
});

      done(err, user);
    
}
});
}));


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
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
//routing
app.use('/', routes);
app.use('/users', routes);



passport.serializeUser(function(user, done) {
done(null, user._id);
});
passport.deserializeUser(function(id, done) {
 Users.findById(id, function(err, user){
     console.log(user);
     if(!err) done(null, user);
     else done(err, null);
 });
});


app.param('user_id', function(req, res, next, id){
	Users.findOne({authId: id}, function(err, user){
		if(err) {return next(err);}
		req.user = user;
		next();
	});
});
app.get('/auth/facebook',
passport.authenticate('facebook',
{scope: 'email'}), function(req, res){
});


app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/profile',
                                      failureRedirect: '/login' }));
//profile section
app.get('/profile/:user_id?', function(req, res){
	if(req.user){
		res.json(200, req.user);
		
	}else{
Users.findById(req.session.passport.user, function(err, user){
		if(err) {
			console.log(err);
			res.send(500);
		}
		res.json(200, user);
	});
}
});

app.get('/auth/google', passport.authenticate('google'));

// Google will redirect the user to this URL after authentication.  Finish
// the process by verifying the assertion.  If valid, the user will be
// logged in.  Otherwise, authentication has failed.
app.get('/auth/google/return',
  passport.authenticate('google', { successRedirect: '/',
                                    failureRedirect: '/login' }));
                                    
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
