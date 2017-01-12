
var express = require('express');
var api = express.Router();
var User = require('../models/user');
var Post = require('../models/post');
var Category = require('../models/category');
var Business = require('../models/business');

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
                categories: JSON.parse(req.body.categories)
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