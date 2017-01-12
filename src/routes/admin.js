
var express = require('express');
var admin = express.Router();
var User = require('../models/user');
var Post = require('../models/post');
var Category = require('../models/category');
var Business = require('../models/business');

var mid = require('../middleware');

function getCatsForPost(post, categories){
    let catarray = [];
                                    
    for(let i=0; i<categories.length; i++){

        let checked = false;

        for(let j=0; j<post.categories.length; j++){
            if(categories[i]._id == post.categories[j]){
                checked = true;
            }
        }

        let catObj = {
            catid: categories[i]._id,
            catname: categories[i].name,
            checked: checked
        };
        catarray.push(catObj);
    }

    return catarray;
}

// admin dashboard
admin.get('/', mid.requiresLogin, function(req, res, next){

  User.findById(req.session.userId)
    .exec(function(error, user){
      if(error){
        next(error);
      }else{

        // check if admin
        if(user.isadmin){
          res.render('admin', {
            title: 'Admin',
            fullname: user.fullname
          });
        }else{
          return res.redirect('/');
        }

      }
    });

});


admin.get('/posts', mid.requiresLogin, function(req, res, next){

  User.findById(req.session.userId)
    .exec(function(error, user){
      if(error){
        next(error);
      }else{

        // check if admin
        if(user.isadmin){

          Post.find({}, function(err, posts){

            if(error){
              next(error);
            }else{
              res.render('admin_posts', {
                title: 'Posts',
                fullname: user.fullname,
                posts: posts,
                admin_script: 'posts'
              });
            }

          });

        }else{
            return res.redirect('/');
        }

      }
    });
});

admin.get('/posts/new', mid.requiresLogin, function(req, res, next){

  User.findById(req.session.userId)
    .exec(function(error, user){
      if(error){
        next(error);
      }else{

        // check if admin
        if(user.isadmin){

            Category.find({}).sort({$natural:-1}).exec(function(error, categories){

                if(error){
                    next(error);
                }else{
                    
                    res.render('admin_posts_new', {
                        title: 'Create New Post',
                        fullname: user.fullname,
                        categories: categories,
                        user: user, 
                        admin_script: 'posts'
                    });

                }

            });

        }else{
            return res.redirect('/');
        }

      }
    });
});

admin.get('/posts/:id', mid.requiresLogin, function(req, res, next){

    let postid = req.params.id;

    User.findById(req.session.userId)
        .exec(function(error, user){
                if(error){
                    next(error);
                }else{
                // check if admin
                    if(user.isadmin){

                        Post.findOne({"_id": postid}, function(error, post){

                            if(error){
                                console.log(error);
                            }else{

                                Category.find({}).sort({$natural:-1}).exec(function(error, categories){

                                    if(error){
                                        next(error);
                                    }else{

                                        const catarray = getCatsForPost(post, categories);

                                        res.render('admin_post_edit', {
                                            title: 'Edit Post',
                                            fullname: user.fullname,
                                            post: post,
                                            postid: postid,
                                            categories: catarray,
                                            admin_script: 'posts'
                                        });

                                    }

                                });

                            }

                        });

                }else{
                    return res.redirect('/');
                }

            }
        });

});

admin.get('/users', mid.requiresLogin, function(req, res, next){

  User.findById(req.session.userId)
    .exec(function(error, user){
      if(error){
        next(error);
      }else{

        // check if admin
        if(user.isadmin){

            User.find({}).sort({$natural:-1}).exec(function(error, users){

                if(error){
                    next(error);
                }else{
                    
                    res.render('admin_users', {
                        title: 'Admin',
                        fullname: user.fullname,
                        users: users,
                        admin_script: 'users'
                    });

                }

            });

        }else{
          return res.redirect('/');
        }

      }
    });

});

admin.get('/users/new', mid.requiresLogin, function(req, res, next){

  User.findById(req.session.userId)
    .exec(function(error, user){
      if(error){
        next(error);
      }else{

        // check if admin
        if(user.isadmin){

            res.render('admin_users_new', {
                title: 'Admin',
                fullname: user.fullname,
                admin_script: 'users'
            });

        }else{
          return res.redirect('/');
        }

      }
    });

});

admin.get('/visitors', mid.requiresLogin, function(req, res, next){

  User.findById(req.session.userId)
    .exec(function(error, user){
      if(error){
        next(error);
      }else{

        // check if admin
        if(user.isadmin){
          res.render('admin_visitors', {
            title: 'Admin',
            fullname: user.fullname
          });
        }else{
          return res.redirect('/');
        }

      }
    });
});


/*****************************************************************

	Business Stuff here that need to be removed from basic cms 

*******************************************************************/

admin.get('/businesses', mid.requiresLogin, function(req, res, next){

  User.findById(req.session.userId)
    .exec(function(error, user){
      if(error){
        next(error);
      }else{

        // check if admin
        if(user.isadmin){

          Business.find({}, function(err, businesses){

            if(error){
              next(error);
            }else{
              res.render('admin_businesses', {
                title: 'Admin',
                fullname: user.fullname,
                businesses: businesses,
                admin_script: 'business'
              });
            }

          });

        }else{
          return res.redirect('/');
        }

      }
    });
});

admin.get('/businesses/new', mid.requiresLogin, function(req, res, next){

  User.findById(req.session.userId)
    .exec(function(error, user){
      if(error){
        next(error);
      }else{

        const services = [
          'pizza',
          'service2',
          'service3'
        ];

        const industries = [
          'tatto studio',
          'pizza',
          'coffee shop'
        ];

        // check if admin
        if(user.isadmin){
          res.render('admin_businesses_new', {
            title: 'Add New Business',
            fullname: user.fullname,
            services: services,
            industries: industries,
            admin_script: 'business'
          });
        }else{
          return res.redirect('/');
        }

      }
    });
});

admin.get('/businesses/:id', mid.requiresLogin, function(req, res, next){

  let businessid = req.params.id;

  User.findById(req.session.userId)
    .exec(function(error, user){
      if(error){
        next(error);
      }else{
        // check if admin
        if(user.isadmin){

          const services = [
            'pizza',
            'service2',
            'service3'
          ];

          const industries = [
            'tatto studio',
            'pizza',
            'coffee shop'
          ];

          Business.findOne({"_id": businessid}, function(error, business){
            res.render('admin_businesses_edit', {
              title: 'Edit Business',
              fullname: user.fullname,
              business: business,
              services: services,
              industries: industries,
              businessid: businessid,
              admin_script: 'business'
            });
          });

        }else{
          return res.redirect('/');
        }

      }
    });
});

module.exports = admin;