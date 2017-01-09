'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var User = require('./models/user.js');

var app = express();

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/static', express.static(__dirname + '/public'));

app.set('view engine', 'pug');
app.set('views', __dirname + '/templates');

/** Database stuff **/

mongoose.Promise = global.Promise
// mongodb connection
mongoose.connect("mongodb://localhost:27017/cms");
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

var routes = require('./routes/index');
app.use('/', routes);

app.listen(3000);