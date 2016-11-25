var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var session=require('express-session');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var busboy = require('busboy');

/*这里写相应页面的js文件*/

//var routes = require('./routes/indexTest');
var user = require('./routes/user');

var index = require('./routes/index');

//-------------------------------
require('./servers/db');

var app = express();

// view engine setup

app.set('views', './views/pages');
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({secret:'winty',cookie:{maxAge:86400000}}));

app.use(express.static(path.join(__dirname, '/public')));  //加了'/'

// 定路由
//app.use('/', routes);  //测试之用
app.use('/users', user);

app.use('/', index);
//---------------------------

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
