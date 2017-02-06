
var express = require('express');
var admin = express.Router();
var User = require('../models/user');
var Post = require('../models/post');
var Category = require('../models/category');

var mid = require('../middleware');

// admin dashboard

admin.get('/', mid.checkUserAdmin, function(req, res, next){

    res.render('admin', {
        title: 'Admin',
        user: req.thisUser,
        fullname: req.thisUser.fullname
    });

});

admin.get('/posts', mid.checkUserAdmin, function(req, res, next){

    mid.give_permission(req.thisUser, 'manage_posts', res, function(){

        Post.find({}, function(err, posts){

            if(err){
                next(err);
            }else{
                res.render('admin_posts', {
                    title: 'Posts',
                    user: req.thisUser,
                    fullname: req.thisUser.fullname,
                    posts: posts,
                    admin_script: 'posts'
                });
            }

        });

    });

});

admin.get('/posts/new', mid.checkUserAdmin, function(req, res, next){

    mid.give_permission(req.thisUser, 'manage_posts', res, function(){

        Category.find({}).sort({$natural:-1}).exec(function(error, categories){

            if(error){
                next(error);
            }else{

                res.render('admin_posts_new', {
                    title: 'Create New Post',
                    user: req.thisUser,
                    fullname: req.thisUser.fullname,
                    categories: categories,
                    // user: user, 
                    admin_script: 'posts'
                });

            }

        });

    });

});

admin.get('/posts/:id', mid.checkUserAdmin, function(req, res, next){

    let postid = req.params.id;

    mid.give_permission(req.thisUser, 'manage_posts', res, function(){

        Post.findOne({"_id": postid}, function(error, post){

            if(error){
               // console.log(error);
            }else{

                Category.find({}).sort({$natural:-1}).exec(function(error, categories){

                    if(error){
                        next(error);
                    }else{

                        const catarray = mid.getCatsForPost(post, categories);

                        res.render('admin_post_edit', {
                            title: 'Edit Post',
                            user: req.thisUser,
                            fullname: req.thisUser.fullname,
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

});

admin.get('/users', mid.checkUserAdmin, function(req, res, next){

    mid.give_permission(req.thisUser, 'manage_users', res, function(){

        User.find({}).sort({$natural:-1}).exec(function(error, users){

            if(error){
                next(error);
            }else{
                
                res.render('admin_users', {
                    title: 'Admin',
                    user: req.thisUser,
                    fullname: req.thisUser.fullname,
                    users: users,
                    admin_script: 'users'
                });

            }

        });

    });

});

admin.get('/users/new', mid.checkUserAdmin, function(req, res, next){

    mid.give_permission(req.thisUser, 'manage_users', res, function(){
            res.render('admin_users_new', {
            title: 'Admin',
            user: req.thisUser,
            fullname: req.thisUser.fullname,
            admin_script: 'users'
        });
    });

});


admin.get('/users/:id', mid.checkUserAdmin, function(req, res, next){

    mid.give_permission(req.thisUser, 'manage_users', res, function(){

        let userid = req.params.id;

        User.findOne({"_id": userid}, function(error, edUser){

            if(error){
                // console.log(error);
            }else{

                res.render('admin_user_edit', {
                    title: 'Edit User',
                    user: req.thisUser,
                    fullname: req.thisUser.fullname,
                    edUser: edUser,
                    userid: userid,
                    admin_script: 'users'
                });

            }

        });

    });

});


module.exports = admin;