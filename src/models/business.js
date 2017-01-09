var mongoose = require('mongoose');
var BusinessSchema = new mongoose.Schema({
	name: String,
	website: String,
	phone: String,
	email: String,
	fladdress: String,
	town: String,
	postcode: String,
	industry: String,
	openinghours: String,
	serv1: String,
	serv2: String,
	serv3: String,
	facebook: String,
	twitter: String,
	instagram: String,
	youtube: String,
	linkedin: String
});

var Business = mongoose.model('Business', BusinessSchema);
module.exports = Business;

