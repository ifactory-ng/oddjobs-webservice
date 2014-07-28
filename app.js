var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var schema = require('./conf/schema');
//var routes = require('./routes/users');
var api = require('./routes/users');
var passport = require('passport');
var config = require('./conf/auth');

passport.serializeUser(function(user, done) {
done(null, user);
});
passport.deserializeUser(function(obj, done) {
done(null, obj);
});
var User = schema.userModel;

// config
/*passport.use(new FacebookStrategy({
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
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

//routing

/*app.get('/auth/facebook',
passport.authenticate('facebook',
{scope: 'email'}));

app.get('auth/facebook/callback',
passport.authenticate('facebook', {failureRedirect: '/error'}),
function(req, res){
	res.redirect('/profile');
}
);
*/
//profile section
app.get('/profile', ensureAuthenticated, function(req, res){
	User.findById(req.session.passport.user, function(err, user){
		if(err) {
			console.log(err);
			res.json(401);
		}
		else{
			res.json(200, user);
		}
	});
});

app.get('/profile/:id', api.user);
app.put('/profile/:id', api.infoUpdate);
app.put('/profile/shop/create/:id');
//shop section
app.post('/addProduct');

function ensureAuthenticated(req, res, next){
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/');
}
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
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


module.exports = app;
