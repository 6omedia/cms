'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var fs = require("fs");

var User = require('./models/user.js');

var app = express();

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/static', express.static(__dirname + '/public'));

app.set('view engine', 'pug');
app.set('views', __dirname + '/templates');

fs.stat('config.js', function(err, stat) {

    if(err == null) {
    	const config = require('../config');
	    const conf_vars = config.get_config_vars();
	    process.env.MONGODB_URI = conf_vars.env_database;
	    process.env.S3_BUCKET_NAME = conf_vars.env_bucket;
		process.env.AWS_ACCESS_KEY_ID = conf_vars.env_aws_access_key;
		process.env.AWS_SECRET_ACCESS_KEY = conf_vars.env_aws_secret_key;
    }

    /** Database stuff **/

	mongoose.Promise = global.Promise;
	// mongodb connection
	mongoose.connect(process.env.MONGODB_URI);
	var db = mongoose.connection;

	// mongo error
	db.on('error', console.error.bind(console, 'connection error:'));

	app.use(session({
		secret: 'secret of some sort',
		resave: true,
		saveUninitialized: false,
		store: new MongoStore({
			mongooseConnection: db
		})
	}));

	// make user id available in templates
	app.use(function(req, res, next){
		res.locals.currentUser = req.session.userId;
		next();
	});

	/** Routes **/

	// CMS

	// main routes
	var cms_routes = require('./routes/cms/cms_main.js');
	app.use('/', cms_routes);

	// admin routes
	var cms_admin_routes = require('./routes/cms/cms_admin.js');
	app.use('/admin', cms_admin_routes);

	// api routes
	var cms_api_routes = require('./routes/cms/cms_api.js');
	app.use('/admin/api', cms_api_routes);

	// EXTENDED

	// main routes
	var routes = require('./routes/main.js');
	app.use('/', routes);

	// admin routes
	var admin_routes = require('./routes/admin.js');
	app.use('/admin', admin_routes);

	// api routes
	var api_routes = require('./routes/api.js');
	app.use('/admin/api', api_routes);

	app.listen(3000);

});