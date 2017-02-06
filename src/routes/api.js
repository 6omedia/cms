
var express = require('express');
var api = express.Router();
var bcrypt = require('bcryptjs');
var User = require('../models/user');
var Post = require('../models/post');
var Category = require('../models/category');

var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

var uuid = require('node-uuid');

var mid = require('../middleware');

/* Posts */

api.post('/add_post', mid.checkUserAdmin, function(req, res, next){

    let data = {};
    data.success = '0';

    const post = new Post(
        {
            title: req.body.title,
            slug: req.body.slug,
            body: req.body.body,
            categories: JSON.parse(req.body.categories),
            feat_img: req.body.feat_img,
            user_id: req.body.user_id,
            date: req.body.date
        }
    );

    //save model to MongoDB
    post.save(function (err) {

        if(err) {
            data.error = err;
            res.send(data);
        }else{
            data.success = '1';
            res.send(data);
        }

    });

});

api.post('/update_post', mid.checkUserAdmin, function(req, res, next){

    let data = {};
    data.success = '0';
    const postid = req.body.postid;

    Post.update(
        {
        "_id": postid
        }, 
        {
            $set: {
                title: req.body.title,
                slug: req.body.slug,
                body: req.body.body,
                categories: JSON.parse(req.body.categories),
                feat_img: req.body.feat_img
            }
        },
        function(err, affected, resp){
            if(err){
                data.error = err;
                res.send(data);
            }else{
                // console.log(affected);
                data.success = '1';
                res.send(data);
            }
        }
    );

});

// Categories

api.post('/add_cat', mid.checkUserAdmin, function(req, res, next){

    let data = {};
    data.success = '0';
    
    const category = new Category(
        {
          name: req.body.name,
          description: req.body.description
        }
    );

    //save model to MongoDB
    category.save(function (err, cat) {

        if(err) {
            data.error = err;
            res.send(data);
        }else{
            data.success = '1';
            data.catname = cat.name; 
            data.catid = cat._id;
            res.send(data);
        }

    });

});


api.post('/delete', mid.checkUserAdmin, function(req, res, next){

    let data = {};
    data.success = '0';
    
    const delete_item = req.body.delete_item;

    switch(delete_item){
        case 'post':

            Post.remove({ "_id" : req.body.itemid }, function(err){
              if(err){
                res.send(data);
              }else{
                data.success = '1';
                res.send(data);
              }
            });

        break;
        case 'category':

            Category.remove({ "_id" : req.body.itemid }, function(err, removed){
                data.removed = removed;
                if(err){
                    data.error = err;
                    res.send(data);
                }else{

                    if(removed){
                        data.success = '1';
                    }
                    
                    res.send(data);
                }
            });

        break;
        case 'user':

            User.findById({ "_id" : req.body.itemid }, function(err, theUser){

                if(err){
                    res.send(data);
                }else{

                    if(!theUser.isSuperAdmin){

                        User.remove({ "_id" : req.body.itemid }, function(err, removed){
                            data.removed = removed;
                            if(err){
                                data.error = err;
                                res.send(data);
                            }else{

                                if(removed){
                                    data.success = '1';
                                }
                                
                                res.send(data);
                            }
                        });

                    }else{
                        data.error = 'Can not delete a Super Admin';
                        res.send(data);
                    }

                }

            });

        break;
    }

});


api.post('/add_user', mid.checkUserAdmin, function(req, res, next){

    let data = {};
    data.success = '0';

    const permissions = JSON.parse(req.body.permissions);

    console.log(req.body);

    // create obj with form input
    var userData = {
        ip: '',
        fullname: req.body.fullname,
        email: req.body.email,
        password: req.body.password,
        user_role: req.body.user_role,
        // isadmin: req.body.isadmin,
        permissions: [{
            manage_posts: permissions[0].checked,
            manage_users: permissions[1].checked
        }]
    }

    // add to mongo db
    User.create(userData, function(error, user){
        if( error ){
            console.log('1', error);
            res.send(error);
        }else{
            data.success = '1';
            res.send(data);
        }
    });

});

api.post('/update_user', mid.checkUserAdmin, function(req, res, next){

    let data = {};
    data.success = '0';
    const userid = req.body.userid;

    const permissions = JSON.parse(req.body.permissions);

    let updateObj = {};

    const changepassword = req.body.changepassword;

    if(changepassword == "true"){

        let hashedPassword = '';

        bcrypt.hash(req.body.password, 5, function(err, hash){

            if(err){
                data.error = err;
                res.send(data);
            }

            updateObj = {
                $set: {
                    fullname: req.body.fullname,
                    email: req.body.email,
                    password: hash,
                    isadmin: req.body.isadmin,
                    permissions: [{
                        manage_posts: permissions[0].checked,
                        manage_users: permissions[1].checked
                    }]
                }
            };

            User.update({"_id": userid}, updateObj, function(err, affected, resp){

                if(err){
                    data.error = err;
                    res.send(data);
                }else{
                    data.success = '1';
                    res.send(data);
                }
            });

        });

    }else{

        updateObj = {
            $set: {
                fullname: req.body.fullname,
                email: req.body.email,
                isadmin: req.body.isadmin,
                permissions: [{
                    manage_posts: permissions[0].checked,
                    manage_users: permissions[1].checked
                }]
            }
        };

        User.update({"_id": userid}, updateObj, function(err, affected, resp){

            if(err){
                data.error = err;
                res.send(data);
            }else{
                // console.log(affected);
                data.success = '1';
                res.send(data);
            }
        });

    }

});

// Image uploads

api.post('/upload/:subfolder', mid.checkUserAdmin, function(req, res, next){

    const subFolder = req.params.subfolder;

    let data = {};
    data.success = '0';

    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '../public/uploads/' + subFolder);

    const fuid = uuid.v4();
    // console.log(test);

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(field, file) {
        // fs.rename(file.path, path.join(form.uploadDir, file.name));
        fs.rename(file.path, path.join(form.uploadDir, fuid + file.name));
        data.filename = fuid + file.name;
    });

    // log any errors that occur
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
        res.send('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
        res.send(data);
        res.end('success');
    });

    // parse the incoming request containing the form data
    form.parse(req);
            
});

module.exports = api;