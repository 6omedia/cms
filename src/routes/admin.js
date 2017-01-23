
var express = require('express');
var admin = express.Router();
var User = require('../models/user');
var Post = require('../models/post');
var Category = require('../models/category');

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
            user: user,
            fullname: user.fullname
          });
        }else{
          return res.redirect('/');
        }

      }
    });

});

function give_permission(user, permission, res, permitedFuction){

	if(user.permissions.length > 0){

		if(permission in user.permissions[0]){
			if(user.permissions[0][permission]){

				permitedFuction();
			
			}else{

				res.status(401).render('admin_error', {
					error_message: 'You don\'t have the correct permissions to access this page'
				});
			
			}
		}else{

			res.status(401).render('admin_error', {
				error_message: 'You don\'t have the correct permissions to access this page'
			});

		}

	}else{

		res.status(401).render('admin_error', {
			error_message: 'You don\'t have the correct permissions to access this page'
		});

	}

}

admin.get('/posts', mid.requiresLogin, function(req, res, next){

  User.findById(req.session.userId)
    .exec(function(error, user){
      if(error){
        next(error);
      }else{

        // check if admin
        if(user.isadmin){

        	give_permission(user, 'manage_posts', res, function(){

        		Post.find({}, function(err, posts){

		            if(error){
		              next(error);
		            }else{
		              res.render('admin_posts', {
		                title: 'Posts',
                        user: user,
		                fullname: user.fullname,
		                posts: posts,
		                admin_script: 'posts'
		              });
		            }

		        });

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

        	give_permission(user, 'manage_posts', res, function(){

        		Category.find({}).sort({$natural:-1}).exec(function(error, categories){

	                if(error){
	                    next(error);
	                }else{

                        // const options = {
                        //     content_blocks: false,
                        //     track_visitors: false
                        // }
	                    
	                    res.render('admin_posts_new', {
	                        title: 'Create New Post',
                            user: user,
	                        fullname: user.fullname,
	                        categories: categories,
	                        user: user, 
	                        admin_script: 'posts'
	                    });

	                }

	            });

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

                    	give_permission(user, 'manage_posts', res, function(){

			        		Post.findOne({"_id": postid}, function(error, post){

	                            if(error){
	                               // console.log(error);
	                            }else{

	                                Category.find({}).sort({$natural:-1}).exec(function(error, categories){

	                                    if(error){
	                                        next(error);
	                                    }else{

	                                        const catarray = getCatsForPost(post, categories);

	                                        res.render('admin_post_edit', {
	                                            title: 'Edit Post',
                                                user: user,
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

        	give_permission(user, 'manage_users', res, function(){

        		User.find({}).sort({$natural:-1}).exec(function(error, users){

	                if(error){
	                    next(error);
	                }else{
	                    
	                    res.render('admin_users', {
	                        title: 'Admin',
                            user: user,
	                        fullname: user.fullname,
	                        users: users,
	                        admin_script: 'users'
	                    });

	                }

	            });

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

        	give_permission(user, 'manage_users', res, function(){
        		res.render('admin_users_new', {
	                title: 'Admin',
                  user: user,
	                fullname: user.fullname,
	                admin_script: 'users'
	            });
        	});

        }else{
          return res.redirect('/');
        }

      }
    });

});


admin.get('/users/:id', mid.requiresLogin, function(req, res, next){

    User.findById(req.session.userId)
        .exec(function(error, user){
                if(error){
                    next(error);
                }else{
                // check if admin
                    if(user.isadmin){

                    	give_permission(user, 'manage_users', res, function(){

                    		let userid = req.params.id;

			        		User.findOne({"_id": userid}, function(error, edUser){

	                            if(error){
	                                // console.log(error);
	                            }else{

	                                res.render('admin_user_edit', {
                                        title: 'Edit User',
                                        user: user,
                                        fullname: user.fullname,
                                        edUser: edUser,
                                        userid: userid,
                                        admin_script: 'users'
                                    });

	                            }

	                        });

			        	});

                }else{
                    return res.redirect('/');
                }

            }
        });

});


module.exports = admin;