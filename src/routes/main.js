
var express = require('express');
var main = express.Router();
var User = require('../models/user');
var Post = require('../models/post');
// var Category = require('../models/category');
var Taxonomy = require('../models/taxonomy');
// var mongoosePages = require('mongoose-pages');

var mid = require('../middleware');
var frontend = require('../middleware/frontend');

main.get('/', function(req, res){
    const path = req.path;
    res.locals.path = path;

    Post.find({}).sort({view_count: -1}).exec(function(err, posts){

        if(err){
            next(err);
        }else{

            res.render('index', 
                {
                    title: 'Website',
                    posts: posts,
                    meta_description: 'Meta description for website'
                }
            );
        }

    });

});

main.get('/posts/page/:pageNum', function(req, res){

    const path = req.path;
    res.locals.path = path;

    var docsPerPage = 10;
    var pageNumber = req.params.pageNum;
    var offset = (pageNumber * docsPerPage) - docsPerPage;

    Post.count({}, function(err, count){

      Post.find({}).skip(offset).limit(docsPerPage).sort({view_count: -1}).exec(function(err, posts){

          if(err){
              next(err);
          }else{

              const pageinationLinks = frontend.createPaginationLinks(docsPerPage, pageNumber, '/posts/page', count);

              res.render('posts', 
                  {
                      title: 'All Posts',
                      posts: posts,
                      pageinationLinks: pageinationLinks,
                      meta_description: 'Meta description for website'
                  }
              );
          }

      });

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
          fullname: user.fullname,
          meta_description: ''
        });
      }
    });
});

module.exports = main;