
var express = require('express');
var main = express.Router();
var User = require('../models/user');
var Post = require('../models/post');
var Category = require('../models/category');
var mid = require('../middleware');

// define the home page route
// Home

main.get('/', function(req, res){
    const path = req.path;
    res.locals.path = path;

    Post.find({}, function(err, posts){

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

/** User Routes and backend **/

// login for user or admin assign user a permission
main.get('/login', mid.loggedOut, function(req, res){
  res.render('login');
});

main.post('/login', function(req, res, next){
  if(req.body.email && req.body.password){
    User.authenticate(req.body.email, req.body.password, function(error, user){
      if(error || !user){
        var err = new Error('Wrong email or password');
        err.status = 401;
        res.render('error', {title: 'Error', error: err});
      }else{
        req.session.userId = user._id;

        User.findById(req.session.userId)
          .exec(function(error, user){
            if(error){
              next(error);
            }else{

              // check if admin
              if(user.isadmin){
 
                res.redirect('/admin');

              }else{
                return res.redirect('/profile');
              }

            }
          });

      }
    });
  }else{
    var err = new Error('No email or password submited');
    err.status = 400;
    res.render('error', {title: 'Error', error: err});
  }
});

// register/signup (only for non-admins)

main.get('/signup', mid.loggedOut, function(req, res){
  res.render('signup', {title: 'Sign Up'});
});

main.post('/signup', function(req, res, next){
  if(req.body.fullName &&
     req.body.email && 
     req.body.password &&
     req.body.passwordConfirm){

    // confirmed password
    if(req.body.password !== req.body.passwordConfirm){
      var err = new Error('Passwords do not match');
      err.status = 400;
      res.render('error', {title: 'Error', error: err}); // res.send(err); //next(err);
    }

    // create obj with form input
    var userData = {
      fullname: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      isadmin: false,
      permissions: [{
        manage_posts: false,
        manage_users: false
      }]
    }

    // add to mongo db
    User.create(userData, function(error, user){
      if( error ){
        next(error);
      }else{
        req.session.userId = user._id;
        res.redirect('/profile');
      }
    });

  }else{
    var err = new Error('Please fill out required fields');
    err.status = 400;
    res.render('error', {title: 'Error', error: err});
  }

});

main.get('/logout', function(req, res, next){
  if(req.session){
    req.session.destroy(function(err){
      if(err){
        next(err);
      }else{
        res.redirect('/');
      }
    });
  }
});

main.get('/posts/:slug', function(req, res, next){
  
    const slug = req.params.slug;

    Post.find({slug: slug}).exec(function(err, post){
        res.render('single_post', {
            post: post
        });
    });

});

module.exports = main;
