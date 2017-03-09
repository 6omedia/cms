
var express = require('express');
var cms_admin = express.Router();
var User = require('../../models/user');
var Post = require('../../models/post');
var Taxonomy = require('../../models/taxonomy');

var mid = require('../../middleware');

// admin dashboard

cms_admin.get('/', mid.checkUserAdmin, function(req, res, next){

    res.render('admin', {
        title: 'Admin',
        user: req.thisUser,
        fullname: req.thisUser.fullname
    });

});

cms_admin.get('/posts', mid.checkUserAdmin, function(req, res, next){

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

cms_admin.get('/posts/new', mid.checkUserAdmin, function(req, res, next){

    mid.give_permission(req.thisUser, 'manage_posts', res, function(){

        Taxonomy.find({taxonomy_name: 'Categories'}).sort({$natural:-1}).exec(function(error, categories){

            if(error){
                next(error);
            }else{

                res.render('admin_posts_new', {
                    title: 'Create New Post',
                    user: req.thisUser,
                    fullname: req.thisUser.fullname,
                    categories: categories[0].taxonomy_terms,
                    admin_script: 'posts'
                });

            }

        });

    });

});

cms_admin.get('/posts/:id', mid.checkUserAdmin, function(req, res, next){

    let postid = req.params.id;

    mid.give_permission(req.thisUser, 'manage_posts', res, function(){

        Post.findOne({"_id": postid}, function(error, post){

            if(error){
               // console.log(error);
            }else{

                Taxonomy.find({taxonomy_name: 'Categories'}).sort({$natural:-1}).exec(function(error, categories){

                    if(error){
                        next(error);
                    }else{

                        let postCats = '';
                        // let catarray = [];

                        if(post.taxonomies[0] != undefined){
                            postCats = post.taxonomies[0].terms;
                        }

                        catarray = mid.getCatsForPost(postCats, categories[0].taxonomy_terms);

                        console.log(post);

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

cms_admin.get('/users', mid.checkUserAdmin, function(req, res, next){

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

cms_admin.get('/users/new', mid.checkUserAdmin, function(req, res, next){

    mid.give_permission(req.thisUser, 'manage_users', res, function(){
            res.render('admin_users_new', {
            title: 'Admin',
            user: req.thisUser,
            fullname: req.thisUser.fullname,
            admin_script: 'users'
        });
    });

});


cms_admin.get('/users/:id', mid.checkUserAdmin, function(req, res, next){

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

cms_admin.get('/taxonomy/new', mid.checkUserAdmin, function(req, res, next){

    mid.give_permission(req.thisUser, 'manage_posts', res, function(){

        Taxonomy.find({}, function(err, taxonomies){

            if(err){
                next(err);
            }else{
                
                res.render('admin_tax_new', {
                    title: 'Admin',
                    user: req.thisUser,
                    fullname: req.thisUser.fullname,
                    taxonomies: taxonomies,
                    admin_script: 'taxonomies'
                });

            }

        });

    });

});

cms_admin.get('/taxonomies/:tax_name', mid.checkUserAdmin, function(req, res, next){

    let tax_name = req.params.tax_name;

    mid.give_permission(req.thisUser, 'manage_posts', res, function(){

        const taxName = mid.allTitleCase(tax_name);

        console.log("Tax name: ", taxName);

        Taxonomy.findOne({"taxonomy_name": taxName}).sort({"taxonomy_terms.parent": 1}).exec(function(error, taxonomy){

            if(error){
               next(error);
            }else{

                res.render('admin_tax_terms', {
                    title: 'Taxonomy ' + taxonomy.taxonomy_name,
                    user: req.thisUser,
                    fullname: req.thisUser.fullname,
                    taxonomy: taxonomy,
                    admin_script: 'terms'
                });

            }

        });

    });

});

module.exports = cms_admin;