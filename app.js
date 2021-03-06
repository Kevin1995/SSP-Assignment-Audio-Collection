var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

var session = require('express-session');
var mysql = require('mysql');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var expressSessionOptions = {
  secret:'mySecret',
  resave: false,
  saveUninitialized: false
}
app.use(session(expressSessionOptions));

var dbConnectionInfo = {
  host : 'eu-cdbr-azure-west-d.cloudapp.net',
  user : 'b921d0b7f353bc',
  password : 'd05fc196',
  database : 'audio_collections'
};

var pool  = mysql.createPool(dbConnectionInfo);

// Store the pool object on the express app so I can retrieve it
// from the "route files".
app.set('dbPool', pool);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var loggedIn = function(req, res, next) {
  // Be sure to let the user get to /login without having req.session.username
  // set, otherwise they would never be able to set it
  if ((!req.session.username)) {
    res.redirect('/login');
  }
  else {
    next();
  }
};

app.use('/', index);
app.use('/users', users);
app.use('/users', loggedIn);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
