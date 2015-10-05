var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('cookie-session');
var passport = require('passport');
var LinkedInStrategy = require('passport-linkedin-oauth2').Strategy
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

require('dotenv').load();

var routes = require('./routes/index');
var auth = require('./routes/auth');
var glazes = require('./routes/glazes');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ keys: [process.env.SESSION_KEY1, process.env.SESSION_KEY2] }))

app.use(passport.initialize());
app.use(passport.session());

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: process.env.DEVHOST + "/auth/google/callback",
//     // scope: ['r_emailaddress', 'r_basicprofile'],
//     // state: true
//   },
//   function(accessToken, refreshToken, profile, done) {
//     // here, find or create a document in the user collection, and update it's contents
//     // note: the profile object is unnecessarily big.  Only store the parts you care about here.
//     //return done(null, { id: profile.id, displayName: profile.displayName, token: accessToken })
//     User.findOrCreate({ googleId: profile.id }, function (err, user) {
//        return done(err, user);
//     });
//   }
// ));

passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: process.env.DEVHOST + "/auth/linkedin/callback",
    scope: ['r_emailaddress', 'r_basicprofile'],
    state: true
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, {
      id: profile.id,
      displayName: profile.displayName,
      token: accessToken
    })
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user)
});

app.use(function (req, res, next) {
  res.locals.user = req.user
  next()
});

app.use('/', routes);
app.use('/auth', auth);
app.use('/glazes', glazes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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
