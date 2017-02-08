
var express = require('express');
var main = express.Router();
var User = require('../models/user');
var Post = require('../models/post');
var Category = require('../models/category');

var mid = require('../middleware');

main.get('/yeah', function(req, res, next){

    res.send('NJKNKJ');

});

module.exports = main;