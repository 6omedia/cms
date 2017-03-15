
var express = require('express');
var main = express.Router();
var User = require('../models/user');
var Post = require('../models/post');
// var Category = require('../models/category');
var Taxonomy = require('../models/taxonomy');

var mid = require('../middleware');

main.get('/', function(req, res){
    const path = req.path;
    res.locals.path = path;

    // Post.find({}).sort({date: -1}).exec(function(err, posts){

    Post.find({}).sort({view_count: -1}).exec(function(err, posts){

        if(err){
            next(err);
        }else{
            res.render('index', 
                {
                    title: 'Website',
                    posts: posts
                }
            );
        }

    });

});

// Profile

main.get('/profile', mid.requiresLogin, function(req, res, next){
  User.findById(req.session.userId)
    .exec(function(error, user){
      if(error){
        next(error);
      }else{
        res.render('profile', {
          title: 'Profile',
          fullname: user.fullname
        });
      }
    });
});

module.exports = main;