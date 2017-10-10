//!/usr/bin/env node

/**
 * Module dependencies.
 */
require("babel-register");

var app = require('./app');
var debug = require('debug')('server:server');
var http = require('http');
var webpackMiddleware = require("webpack-dev-middleware");
var webpack = require("webpack");
var config = require('./webpack.config');

var compiler = webpack(config);
var webpackDevMiddlewareInstance = webpackMiddleware(compiler);

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '7209');
app.set('port', port);
app.use(webpackDevMiddlewareInstance);

// setTimeout(function(){
//   console.log('setTimeout')
//   // After a short delay the configuration is changed
//   // in this example we will just add a banner plugin:
//   compiler.apply(new webpack.BannerPlugin('A new banner'));
//   // Recompile the bundle with the banner plugin:
//   webpackDevMiddlewareInstance.invalidate();
// }, 1000);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
