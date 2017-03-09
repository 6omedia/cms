
var express = require('express');
var api = express.Router();
var User = require('../models/user');
var Post = require('../models/post');
// var Category = require('../models/category');
var Taxonomy = require('../models/taxonomy');

var mid = require('../middleware');

api.post('/yeah', function(req, res, next){

    res.send('NJKNKJ');

});

module.exports = api;