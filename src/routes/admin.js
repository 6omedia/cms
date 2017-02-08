
var express = require('express');
var admin = express.Router();
var User = require('../models/user');
var Post = require('../models/post');
var Category = require('../models/category');

var mid = require('../middleware');

admin.get('/yeah', mid.checkUserAdmin, function(req, res, next){

    res.send('NJKNKJ');

});

module.exports = admin;
