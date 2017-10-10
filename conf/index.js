import tool from 'cloneextend'
var conf = {}

conf.defaults = {

	application: {
		routes : ['index','db', 'api']
	},

	db: {
		local_connection: {
		 	host: "125.133.211.143",
			port: 3300,
			user: "laon",
			password: "ruddls88!",
			database: 'test_mido'
		},
	}
}

exports.get = (env, obj) => {
  var settings = tool.cloneextend(conf.defaults, conf[env]);
  return ('object' === typeof obj) ? tool.cloneextend(settings, obj) : settings;
}
