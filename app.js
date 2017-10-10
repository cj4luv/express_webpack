process.env.NODE_ENV = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() === 'production' ) ? 'production' : 'development';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

//routes
var routes = require('./routes/index');
var conf = require('./conf').get(process.env.NODE_ENV);

import auth from './middlewares/auth';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(auth);

// 라우터 미들 웨어 정의
app.use('/', routes);
conf.application.routes.forEach((val) => {
  //require('./routes/' + [val].toString());
  app.use('/'+val, require('./routes/' + [val].toString()));
  // console.log("routes : " + val);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
