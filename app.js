var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var schema = require('./conf/schema');
var schema = require('./conf/auth');
//var routes = require('./routes/index');
var api = require('./routes/users');
var config = require('./conf/auth');
var routes = require('./routes/index');
var route = require('./routes/users');
//var search = require('./routes/search');
var docs = require('express-mongoose-docs');
var cors = require('cors');
var mongoose = require('mongoose');
var session = require('express-session');
var es = require('elasticsearch');
var users = schema.userModel;

var connectionString = 'http://paas:52422704d70bce398fc652bdb0d321d9@bofur-us-east-1.searchly.com';

if (process.env.SEARCHBOX_URL) {
    // Heroku
    connectionString = process.env.SEARCHBOX_URL;

	console.info(connectionString);
}


var client = new es.Client({
    host: connectionString
});




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
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
//routing
docs(app);
app.use('/', routes);
app.use('/', route);
//app.use('/', search);


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




app.get('/search', function(req, res){
client.search({
	      index: 'search_item',
	      type:'document',
        body: {
            "query": {
                "multi_match": {
                    "query": req.query.q,
                    "fields": [ "name", "about", "location", "tag_name", "description", "category"]
                }
            }
        }
    }).then(function (resp) {
        var hits = resp.hits.hits;
       res.json(hits);
    }, function (err) {
        console.trace(err.message);
       res.send(500);
  });
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
