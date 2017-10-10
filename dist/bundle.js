/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _auth = __webpack_require__(5);

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = __webpack_require__(0).Router();


router.post('/register', _auth2.default.register);

router.post('/login', _auth2.default.login);

module.exports = router;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var express = __webpack_require__(0);
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index');
  res.send('welcome');
});

module.exports = router;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var router = __webpack_require__(0).Router();
var auth = __webpack_require__(1);

router.use('/auth', auth);

module.exports = router;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var PUBLIC_KEY = exports.PUBLIC_KEY = 'fifty';

var TOKEN_EXPIRE_TIME = exports.TOKEN_EXPIRE_TIME = 1;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _user = __webpack_require__(6);

var _Encryption = __webpack_require__(7);

var _settings = __webpack_require__(4);

var _Utill = __webpack_require__(8);

// post area
exports.register = function (req, res) {
  var password = req.body.password;
  var hashData = (0, _Encryption.saltHashPassword)(password);

  req.body.password = hashData.passwordHash;
  req.body.password_key = hashData.salt;

  (0, _user.signUp)(req, res);
};

exports.login = function (req, res) {
  var userID = req.body.userID;
  var password = req.body.password;

  var payload = {
    iss: 'localhost.com',
    "http://localhost:3001/api/auth/register": true,
    userID: userID
  };

  (0, _user.getPasswordkey)(req, res).then(function (salt) {
    if (salt !== null) {
      var hash_password = (0, _Encryption.sha512)(password, salt).passwordHash;
      var publicKey = 'fifty';
      var token = (0, _Encryption.makeJWTToken)(payload, publicKey, { expiresIn: (0, _Utill.days)(_settings.TOKEN_EXPIRE_TIME) });
      req.body.password = hash_password;

      (0, _user.login)(req, res).then(function (result) {
        if (result === false) {
          res.send('아이디나 비밀번호가 잘못 되었습니다.');
        } else {
          var msg = {
            result: 'Get success',
            err: '',
            json: result.rows,
            token: token,
            length: result.rows.length
          };
          result.token(token);
          res.json(msg);
        }
      });
    }
  });
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkedToken = exports.getPasswordkey = exports.login = exports.signUp = undefined;

var _mysql = __webpack_require__(17);

var _mysql2 = _interopRequireDefault(_mysql);

var _redis = __webpack_require__(18);

var _redis2 = _interopRequireDefault(_redis);

var _Encryption = __webpack_require__(7);

var _Utill = __webpack_require__(8);

var _settings = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var conf = __webpack_require__(9).get(process.env.NODE_ENV); // DB의 접근

var pool = _mysql2.default.createPool(conf.db.local_connection);

var client = _redis2.default.createClient(6379, '127.0.0.1');

// 회원 가입
var signUp = function signUp(req, res) {
  pool.getConnection(function (err, connection) {
    var insertQuery = 'insert into users set ?';
    connection.query(insertQuery, [req.body], function (err, rows) {
      if (err) {
        // res.end(JSON.stringify(err))
        res.end('사용 하실수 없는 아이디 입니다.');
      } else {
        res.statusCode = 202; // accepted
        var msg = JSON.stringify({
          result: 'Insert success',
          err: '',
          json: req.body,
          length: rows.length
        });
        res.end(msg);
      }
      connection.release();
    });
  });
};

// 비밀번호 키값
var getPasswordkey = function getPasswordkey(req, res) {
  return new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      connection.query('SELECT * FROM users WHERE userID = ' + connection.escape(req.body.userID), function (err, rows) {
        if (err) {
          reject(null);
        } else {
          resolve(rows[0].password_key);
        }
        if (rows.length === 0) {
          res.send(204);return;
        }
      });
      connection.release();
    });
  });
};

// login
var login = function login(req, res) {
  return new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      connection.query('SELECT * FROM users WHERE userID = ' + connection.escape(req.body.userID) + 'AND password = ' + connection.escape(req.body.password), function (err, rows) {
        if (err) {
          reject(false);
        } else {
          var data = {
            rows: rows,
            token: function token(_token) {
              setToken(req.body.userID, _token);
            }
          };
          resolve(data);
        }
        if (rows.length === 0) {
          res.send(204);return;
        }
      });
      connection.release();
    });
  });
};

// set redis db
var setToken = function setToken(userID, token) {
  client.set(userID, token, 'EX', (0, _Utill.days)(_settings.TOKEN_EXPIRE_TIME));
};

// auth middle ware
var checkedToken = function checkedToken(token) {
  return new Promise(function (resolve, reject) {
    var auth = (0, _Encryption.decodeJWT)(token);

    if (auth) {
      client.get(auth, function (err, reply) {
        if (err) {
          res.send('redis error');
        } else {
          if (reply === token) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      });
    } else {
      console.log('auth false');
      reject('redis err');
    }
  });
};

exports.signUp = signUp;
exports.login = login;
exports.getPasswordkey = getPasswordkey;
exports.checkedToken = checkedToken;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genRandomString = exports.sha512 = exports.saltHashPassword = exports.decodeJWT = exports.makeJWTToken = undefined;

var _crypto = __webpack_require__(19);

var _crypto2 = _interopRequireDefault(_crypto);

var _jsonwebtoken = __webpack_require__(20);

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _settings = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var genRandomString = function genRandomString(length) {
  return _crypto2.default.randomBytes(Math.ceil(length / 2)).toString('hex') /** convert to hexadecimal format */
  .slice(0, length); /** return required number of characters */
};

var sha512 = function sha512(password, salt) {
  var hash = _crypto2.default.createHmac('sha512', salt);
  hash.update(password);
  var value = hash.digest('hex');

  return {
    salt: salt,
    passwordHash: value
  };
};

var saltHashPassword = function saltHashPassword(userPassword) {
  var salt = genRandomString(16); /** Gives us salt of length 16 */
  var passwordData = sha512(userPassword, salt);
  // console.log('UserPassword = '+userPassword)
  // console.log('Passwordhash = '+passwordData.passwordHash)
  // console.log('nSalt = '+passwordData.salt)
  return passwordData;
};

var makeJWTToken = function makeJWTToken(payload, hash_password, options) {
  var token = _jsonwebtoken2.default.sign(payload, hash_password, options);

  return token;
};

var decodeJWT = function decodeJWT(token) {
  try {
    var decoded = _jsonwebtoken2.default.verify(token, _settings.PUBLIC_KEY);
    return decoded.userID;
  } catch (err) {
    // err
    return false;
  }
};

exports.makeJWTToken = makeJWTToken;
exports.decodeJWT = decodeJWT;
exports.saltHashPassword = saltHashPassword;
exports.sha512 = sha512;
exports.genRandomString = genRandomString;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var logAndRespond = exports.logAndRespond = function logAndRespond(err, res, status) {
    console.error(err);
    res.statusCode = 'undefined' === typeof status ? 500 : status;
    res.send({
        result: 'error',
        err: err.code
    });
};

var days = exports.days = function days(day) {
    return day * 24 * 60 * 60;
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _cloneextend = __webpack_require__(21);

var _cloneextend2 = _interopRequireDefault(_cloneextend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var conf = {};

conf.defaults = {

	application: {
		routes: ['index', 'db', 'api']
	},

	db: {
		local_connection: {
			host: "125.133.211.143",
			port: 3300,
			user: "laon",
			password: "ruddls88!",
			database: 'test_mido'
		}
	}
};

exports.get = function (env, obj) {
	var settings = _cloneextend2.default.cloneextend(conf.defaults, conf[env]);
	return 'object' === (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) ? _cloneextend2.default.cloneextend(settings, obj) : settings;
};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router(); // var express = require('express');

var moment = __webpack_require__(27);
var ORDER_LIST_DATA = __webpack_require__(28);
var ORDER_PRODUCT_DATA = __webpack_require__(29);
var QNA_DATA = __webpack_require__(30);
var REVIEW_DATA = __webpack_require__(31);
var TABLE_LIST_DATA = __webpack_require__(32);
var ESSENTIAL_INFO_DATA = __webpack_require__(33);
var SELLER_INFO_DATA = __webpack_require__(34);
var KIND_OF_PRODUCT_DATA = __webpack_require__(35);

/* GET home page. */
router.get('/order/list', function (req, res, next) {
  var tmp = ORDER_LIST_DATA;
  for (var key in tmp) {
    tmp[key].date = moment().set('hour', key).format();
  }
  res.json(ORDER_LIST_DATA);
});

router.get('/order/product', function (req, res, next) {
  res.json(ORDER_PRODUCT_DATA);
});

router.get('/qna', function (req, res, next) {
  var tmp = QNA_DATA;
  for (var key in tmp) {
    tmp[key].date = moment().set('hour', key).format();
  }
  res.json(QNA_DATA);
});

router.get('/review', function (req, res) {
  var tmp = REVIEW_DATA;
  for (var key in tmp) {
    tmp[key].date = moment().set('hour', key).format();
  }
  res.json(REVIEW_DATA);
});

router.get('/table/list', function (req, res) {
  var tmp = TABLE_LIST_DATA;
  for (var key in tmp) {
    tmp[key].date = moment().set('hour', key).format();
  }
  res.json(TABLE_LIST_DATA);
});
router.get('/info/essential', function (req, res) {
  res.json(ESSENTIAL_INFO_DATA);
});
router.get('/info/seller', function (req, res) {
  res.json(SELLER_INFO_DATA);
});
router.get('/product/kind', function (req, res) {
  res.json(KIND_OF_PRODUCT_DATA);
});

module.exports = router;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("webpack");

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(14);


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = __webpack_require__(15);
var debug = __webpack_require__(36)('server:server');
var http = __webpack_require__(37);
var webpackMiddleware = __webpack_require__(38);
var webpack = __webpack_require__(12);
var config = __webpack_require__(39);

var compiler = webpack(config);
var webpackDevMiddlewareInstance = webpackMiddleware(compiler);

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '7209');
app.set('port', port);
app.use(webpackDevMiddlewareInstance);

setTimeout(function () {
  // After a short delay the configuration is changed
  // in this example we will just add a banner plugin:
  compiler.apply(new webpack.BannerPlugin('A new banner'));
  // Recompile the bundle with the banner plugin:
  webpackDevMiddlewareInstance.invalidate();
}, 1000);

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

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

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
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

var _auth = __webpack_require__(16);

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

process.env.NODE_ENV = process.env.NODE_ENV && process.env.NODE_ENV.trim().toLowerCase() === 'production' ? 'production' : 'development';

var express = __webpack_require__(0);
var path = __webpack_require__(10);
var favicon = __webpack_require__(22);
var logger = __webpack_require__(23);
var cookieParser = __webpack_require__(24);
var bodyParser = __webpack_require__(25);

var app = express();

//routes
var routes = __webpack_require__(2);
var conf = __webpack_require__(9).get(process.env.NODE_ENV);

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
conf.application.routes.forEach(function (val) {
  //require('./routes/' + [val].toString());
  app.use('/' + val, __webpack_require__(26)("./" + [val].toString()));
  // console.log("routes : " + val);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _user = __webpack_require__(6);

exports.default = function (req, res, next) {
  var method = req.method;
  var url = req.originalUrl;

  var token = req.cookies.token;

  if (url === '/api/auth/login' || token === undefined || url === '/api/auth/register') {
    console.log('cookies', url);
    next();
  } else {
    (0, _user.checkedToken)(token).then(function (auth) {
      if (auth) {
        console.log("일치 로그인 완료");
        next();
      } else {
        res.send('토큰 불 일치 로그인 다시 시도 필요!');
      }
    }).catch(function (err) {
      res.send(err);
    });
  }
};

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("mysql");

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("redis");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("cloneextend");

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = require("serve-favicon");

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./": 2,
	"./api": 3,
	"./api/": 3,
	"./api/auth": 1,
	"./api/auth/": 1,
	"./api/auth/auth.controller": 5,
	"./api/auth/auth.controller.js": 5,
	"./api/auth/index": 1,
	"./api/auth/index.js": 1,
	"./api/index": 3,
	"./api/index.js": 3,
	"./db": 11,
	"./db.js": 11,
	"./index": 2,
	"./index.js": 2
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 26;

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var OrderListData = {
  0: {
    name: '조은농장에서 고령 햇사과',
    price: "42,000원",
    date: '2017.08.22',
    state: '배송 중'
  },
  1: {
    name: '조은농장에서 마약 옥수수',
    price: "32,000원",
    date: '2017.08.22',
    state: '배송 중'
  },
  2: {
    name: '삐삐농장에서 슈퍼 고등어',
    price: "62,000원",
    date: '2017.08.20',
    state: '배송 완료'
  },
  3: {
    name: '안조은농장에서 고령 토마토',
    price: "44,000원",
    date: '2017.08.18',
    state: '주문 취소'
  },
  4: {
    name: '핵농장에서 고령 햇자두',
    price: "51,000원",
    date: '2017.08.15',
    state: '배송 완료'
  },
  5: {
    name: '바밤바농장에서 최강 딸기',
    price: "22,000원",
    date: '2017.08.15',
    state: '주문 취소'
  },
  6: {
    name: '오늘농장에서 불멸의 포도',
    price: "22,000원",
    date: '2017.07.22',
    state: '배송 완료'
  },
  7: {
    name: '하하농장에서 골드키위',
    price: "62,000원",
    date: '2017.07.12',
    state: '배송 완료'
  },
  8: {
    name: '돼지농장에서 레몬',
    price: "32,000원",
    date: '2017.07.07',
    state: '배송 완료'
  },
  9: {
    name: '조은농장에서 딸기',
    price: "62,000원",
    date: '2017.07.05',
    state: '배송 완료'
  }

};

module.exports = OrderListData;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var OrderProductData = {

  0: {
    ProductName: "햇 고구마 (5kg/특상)",
    DeliveryCharge: "무료",
    ProductPrice: 17000,
    Quantity: 2
  },
  1: {
    ProductName: "고령상호 꿀사과 (1kg/특)",
    DeliveryCharge: "무료",
    ProductPrice: 18000,
    Quantity: 1
  },
  2: {
    ProductName: "고령상호 꿀 배 (3kg/특)",
    DeliveryCharge: "무료",
    ProductPrice: 22000,
    Quantity: 3
  }
};

module.exports = OrderProductData;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var QnAData = {
  0: {
    name: '김종국',
    product: "조은농장에서 고령사과",
    Qdate: '2017.08.22',
    Qcontent: '맛이왜이레요 환불해줘요 ㅡㅡ 언제해줄꺼임?',
    Adate: '2017.08.23',
    Acontent: '하하하 죄송합니다 ㅎㅎ 원래 가끔 그럴수도 있으니까 그냥 참고드셈'
  },
  1: {
    name: '조문덕',
    product: "바보농장에서 바보사과",
    date: '2017.08.22',
    content: '이거 색이좀 이상한대 원래그런가요 아님 문제생긴거에여??'
  },
  2: {
    name: '강호동',
    product: "너네농장에서 너네자두",
    date: '2017.08.20',
    content: '우리집 개가 먹고 실신했는데 괜찮을까요 ㅜㅜㅜㅜㅜㅜ'
  },
  3: {
    name: '이기령',
    product: "김씨농장에서 김씨 배",
    date: '2017.08.18',
    content: '농장에 투자하고싶네요 너무 맛있어용 ㅎ 번호좀알려주세요'
  },
  4: {
    name: '공덕두',
    product: "망국농장에서 망국 계란",
    date: '2017.08.15',
    content: '저두 농장하는데 등록하고 싶어요 어케해야대여'
  },
  5: {
    name: '마봉준',
    product: "오로성농장에서 오로성 딸기",
    date: '2017.08.15',
    content: '자꾸 주문했는데 주문 완료 안떠요 왜그래요 ㅡㅡ빨리고쳐주삼'
  },
  6: {
    name: '김호구',
    product: "박봉농장에서 박봉 배",
    date: '2017.07.22',
    content: '항상 잘먹고있는데 물어볼꼐있는데여 사진이랑 너무 안맞아여 실물이랑은 ㅋ'
  },
  7: {
    name: '박기로',
    product: "돌비농장에서 돌비 채널",
    date: '2017.07.12',
    content: '배송 하루종일준비하나여?? 2주넘엇는데 넘하네여 진짜 ㅡㅡ언제와요'
  },
  8: {
    name: '오지로',
    product: "돼지농장에서 돼지바",
    date: '2017.07.07',
    content: '하히후헤홓'
  },
  9: {
    name: "홍다은",
    product: "사람농장에서 사람고기",
    date: '2017.07.05',
    content: '가가가가가가ㅏ기기기긱가가고고고'
  }

};

module.exports = QnAData;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ReviewData = {
  0: {
    name: '아무개',
    data: '2017.08.22',
    content: '판매자님 얼굴도 보고 구매하니까 신용도 가고 그만큼 맛도 좋네옄ㅋ'
  },
  1: {
    name: '김철수',
    data: '2017.08.22',
    content: '아니 이렇게 맛있으면 어떠캅니다 ㅋㅋㅋㅋㅋ 주문 또함'
  },
  2: {
    name: '박근혜',
    data: '2017.08.12',
    content: '완전 맛있어용 ㅎㅎ'
  },
  3: {
    name: '신소율',
    data: '2017.08.12',
    content: '사과 꿀맛입니당 담에 또 시켜먹을려구요 번창하세요 ㅎㅎ'
  },
  4: {
    name: '박진주',
    data: '2017.08.02',
    content: '맛이상해요 다상해서 왔네요 판매자님 너무합니다 환불해줘요 ㅡㅡ'
  },
  5: {
    name: '오지명',
    data: '2017.08.02',
    content: '아니 이렇게 맛있으면 어떠캅니다 ㅋㅋㅋㅋㅋ 주문 또함'
  },
  6: {
    name: '신지애',
    data: '2017.07.22',
    content: '전 별로네요 맛이 너무 시고 다 물러져서 왔어여'
  },
  7: {
    name: '김종국',
    data: '2017.07.22',
    content: '판매자님 얼굴도 보고 구매하니까 신용도 가고 그만큼 맛도 좋네옄ㅋ'
  },
  8: {
    name: '독고영재',
    data: '2017.07.12',
    content: '맛지당'
  },
  9: {
    name: '김나라',
    data: '2017.07.12',
    content: '굿굿'
  }
};

module.exports = ReviewData;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var TableListData = {
  0: {
    date: "17.08.12",
    product: "자두",
    quantity: "38/50",
    state: "판매종료"
  },
  1: {
    date: "17.08.10",
    product: "포도",
    quantity: "50/50",
    state: "완판"
  },
  2: {
    date: "17.08.10",
    product: "맛사과",
    quantity: "38/50",
    state: "판매중단"
  },
  3: {
    date: "17.08.04",
    product: "배",
    quantity: "50/50",
    state: "완판"
  },
  4: {
    date: "17.08.01",
    product: "자두",
    quantity: "50/50",
    state: "완판"
  },
  5: {
    date: "17.07.22",
    product: "포도",
    quantity: "38/50",
    state: "판매중단"
  },
  6: {
    date: "17.07.22",
    product: "햇사과",
    quantity: "38/50",
    state: "판매종료"
  },
  7: {
    date: "17.07.18",
    product: "파인애플",
    quantity: "38/50",
    state: "판매중단"
  },
  8: {
    date: "17.07.18",
    product: "귤",
    quantity: "50/50",
    state: "완판"
  },
  9: {
    date: "17.07.12",
    product: "귤",
    quantity: "50/50",
    state: "완판"
  }
};

module.exports = TableListData;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var EssentialInfoData = {
  name: "햇고구마",
  expiryDate: "농산물이므로 별도의 유통기한은 없으나 가급적 빨리 드시길 바랍니다.",
  unit: "1kg(6~8개입)",
  certification: "무농약 인증",
  producer: "고령상호",
  relatedDeclaration: "유전자변형 농산물 미포함",
  origin: "국내산",
  howToKeep: "실온보관",
  type: "농산물",
  callCenter: "오늘의 시장 고객센터(1644-1234)"
};

module.exports = EssentialInfoData;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var SellerInfoData = {
  tradeMark: "조은농장",
  owner: "임경욱",
  businessNum: "110-93-71844",
  communicationSaleNum: "2017-전남해남-0005호",
  address: "해남군 해남읍 새터길 324",
  phoneNum: "010-9726-1111",
  account: "301-3231-1232-331(농협중앙회)"
};
module.exports = SellerInfoData;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var KindOfProductData = {
  0: {
    price: 17000,
    quality: "5kg/대/특상",
    totalQuantity: 120,
    restQuantity: 32
  },
  1: {
    price: 24000,
    quality: "10kg/대/특상",
    totalQuantity: 21,
    restQuantity: 80
  }
};

module.exports = KindOfProductData;

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = require("debug");

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = require("webpack-dev-middleware");

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

// node에서 제공되는 path 사용하여 OS에 따른 파일경로 이슈를 방지
var path = __webpack_require__(10);
var webpack = __webpack_require__(12);
var nodeExternals = __webpack_require__(40);

module.exports = {
  // 처음 읽어올 파일
  // 여기서부터 import 되어있는 다른 스크립트를 불러온다.
  entry: [path.join(__dirname, 'server.js')],

  // output은 webpack의 번들링 결과물에 대한 설정
  // path - 디렉터리경로
  // publicPath - 브라우저에서 접근하는 경로
  // fileName - 번들링된 파일명
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },

  // 서버 실행시 소스 파일들을 번들링 하여 메모리에 올린다.
  // devServer: {
  //   hot: true,
  //   filename: 'bundle.js',
  //   publicPath: '/',
  // },

  // 번들링하는 동안 node_modules 디렉토리의 모든 패키지를 건너 뜁니다.
  // reids 모듈과 호환성 때문에 추가
  externals: [nodeExternals()],
  // 애플리케이션의타겟 환경
  target: 'node',

  // Babel
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      options: {
        babelrc: false,
        cacheDirectory: true,
        presets: ["es2015", "stage-2"]
      }
    }]
  }
};
/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = require("webpack-node-externals");

/***/ })
/******/ ]);