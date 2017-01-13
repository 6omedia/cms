
var express = require('express');
var api = express.Router();
var bcrypt = require('bcryptjs');
var User = require('../models/user');
var Post = require('../models/post');
var Category = require('../models/category');
var Business = require('../models/business');

var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

var mid = require('../middleware');

/* Posts */

api.post('/add_post', mid.requiresLogin, function(req, res, next){

  User.findById(req.session.userId)
    .exec(function(error, user){
      if(error){
        next(error);
      }else{
        // check if admin
        if(user.isadmin){

            let data = {};
            data.success = '0';

            const post = new Post(
                {
					title: req.body.title,
					slug: req.body.slug,
					body: req.body.body,
					categories: JSON.parse(req.body.categories),
					feat_img: req.body.feat_img,
					user_id: req.body.user_id
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
        
        }else{
      		res.send('error');
        }

      }
    });

});

api.post('/update_post', mid.requiresLogin, function(req, res, next){

  User.findById(req.session.userId)
    .exec(function(error, user){
      if(error){
        next(error);
      }else{
        // check if admin
        if(user.isadmin){

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
        
        }else{
          res.send('error');
        }

      }
    });

});

// Categories

api.post('/add_cat', mid.requiresLogin, function(req, res, next){

    User.findById(req.session.userId)
        .exec(function(error, user){
            if(error){
                next(error);
            }else{
                // check if admin
                if(user.isadmin){

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

                }else{
                  res.send('error');
                }

            }
    });

});


api.post('/delete', mid.requiresLogin, function(req, res, next){

    User.findById(req.session.userId)
        .exec(function(error, user){
            if(error){
                next(error);
            }else{
                // check if admin
                if(user.isadmin){

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
                        case 'business':

                            Business.remove({ "_id" : req.body.itemid }, function(err, removed){
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

                }else{
                  res.send('error');
                }

            }
    });

});


api.post('/add_user', function(req, res, next){

    User.findById(req.session.userId)
    .exec(function(error, user){
      if(error){
        next(error);
      }else{
        // check if admin
        if(user.isadmin){

            let data = {};
            data.success = '0';

            const permissions = JSON.parse(req.body.permissions);

            // create obj with form input
            var userData = {
              fullname: req.body.fullname,
              email: req.body.email,
              password: req.body.password,
              isadmin: req.body.isadmin,
              permissions: [{
                manage_posts: permissions[0].checked,
                manage_users: permissions[1].checked
              }]
            }

            // add to mongo db
            User.create(userData, function(error, user){
              if( error ){
                res.send(error);
              }else{
                
                data.success = '1';
                res.send(data);

              }
            });
             
            
        }else{
          res.send('error');
        }

      }
    });

});

api.post('/update_user', mid.requiresLogin, function(req, res, next){

  User.findById(req.session.userId)
    .exec(function(error, user){
      if(error){
        next(error);
      }else{
        // check if admin
        if(user.isadmin){

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
        
        }else{
            res.send('error');
        }

      }
    });

});

// Image uploads

api.post('/upload', mid.requiresLogin, function(req, res, next){

  User.findById(req.session.userId)
    .exec(function(error, user){
      if(error){
        next(error);
      }else{
        // check if admin
        if(user.isadmin){

	        let data = {};
	        data.success = '0';

	        // create an incoming form object
			var form = new formidable.IncomingForm();

			// specify that we want to allow the user to upload multiple files in a single request
			form.multiples = true;

			// store all uploads in the /uploads directory
			form.uploadDir = path.join(__dirname, '../public/uploads');

			// every time a file has been uploaded successfully,
			// rename it to it's orignal name
			form.on('file', function(field, file) {
				fs.rename(file.path, path.join(form.uploadDir, file.name));
				data.filename = file.name;
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
        
        }else{
          res.send('error');
        }

      }
    });
});


/****************************************************************

	Business Api that needs to be deleted from cms template

*****************************************************************/

api.post('/add_business', mid.requiresLogin, function(req, res, next){

  User.findById(req.session.userId)
    .exec(function(error, user){
      if(error){
        next(error);
      }else{
        // check if admin
        if(user.isadmin){

          let data = {};
          data.success = '0';

          const business = new Business(
            {
              name: req.body.name,
              website: req.body.website,
              phone: req.body.phone,
              email: req.body.email,
              fladdress: req.body.fladdress,
              town: req.body.town,
              postcode: req.body.postcode,
              industry: req.body.industry,
              openinghours: req.body.openinghours,
              serv1: req.body.serv1,
              serv2: req.body.serv2,
              serv3: req.body.serv3,
              facebook: req.body.facebook,
              twitter: req.body.twitter,
              instagram: req.body.instagram,
              youtube: req.body.youtube,
              linkedin: req.body.linkedin
            }
          );

          //save model to MongoDB
          business.save(function (err) {

            if(err) {
              data.error = err;
              return;
            }
            
            data.success = '1';
            res.send(data);
          
          });
        
        }else{
          res.send('error');
        }

      }
    });
});

api.post('/update_business', mid.requiresLogin, function(req, res, next){

  User.findById(req.session.userId)
    .exec(function(error, user){
      if(error){
        next(error);
      }else{
        // check if admin
        if(user.isadmin){

          let data = {};
          data.success = '0';
          const businessid = req.body.businessid;

          Business.update(
            {
              "_id": businessid
            }, 
            {
              $set: {
                name: req.body.name,
                website: req.body.website,
                phone: req.body.phone,
                email: req.body.email,
                fladdress: req.body.fladdress,
                town: req.body.town,
                postcode: req.body.postcode,
                industry: req.body.industry,
                openinghours: req.body.openinghours,
                serv1: req.body.serv1,
                serv2: req.body.serv2,
                serv3: req.body.serv3,
                facebook: req.body.facebook,
                twitter: req.body.twitter,
                instagram: req.body.instagram,
                youtube: req.body.youtube,
                linkedin: req.body.linkedin
              }
            },
            function(err, affected, resp){
              if(err){
                data.error = err;
                return;
              }else{
                console.log(affected);
                data.success = '1';
                res.send(data);
              }
            }
          );
        
        }else{
          res.send('error');
        }

      }
    });
});



module.exports = api;