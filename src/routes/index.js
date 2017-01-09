var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Business = require('../models/business');
var mid = require('../middleware');

// Home

router.get('/', function(req, res){
  const path = req.path;
  res.locals.path = path;
  res.render('index', {title: 'My Local'});
});

// Profile

router.get('/profile', mid.requiresLogin, function(req, res, next){
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
router.get('/login', mid.loggedOut, function(req, res){
  res.render('login');
});

router.post('/login', function(req, res, next){
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
                res.render('admin', {
                  title: 'Profile',
                  fullname: user.fullname
                });
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

router.get('/signup', mid.loggedOut, function(req, res){
  res.render('signup', {title: 'Sign Up'});
});

router.post('/signup', function(req, res, next){
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
      isadmin: false
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

router.get('/logout', function(req, res, next){
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

/// Admin

// admin dashboard
router.get('/admin', mid.requiresLogin, function(req, res, next){

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

router.get('/admin/businesses', mid.requiresLogin, function(req, res, next){

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

router.get('/admin/businesses/new', mid.requiresLogin, function(req, res, next){

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

router.get('/admin/businesses/:id', mid.requiresLogin, function(req, res, next){

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

router.get('/admin/posts', mid.requiresLogin, function(req, res, next){

  User.findById(req.session.userId)
    .exec(function(error, user){
      if(error){
        next(error);
      }else{

        // check if admin
        if(user.isadmin){
          res.render('admin_posts', {
            title: 'Admin',
            fullname: user.fullname
          });
        }else{
          return res.redirect('/');
        }

      }
    });
});

router.get('/admin/visitors', mid.requiresLogin, function(req, res, next){

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

router.post('/admin/api/add_business', mid.requiresLogin, function(req, res, next){

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

router.post('/admin/api/update_business', mid.requiresLogin, function(req, res, next){

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

router.post('/admin/api/delete_business', mid.requiresLogin, function(req, res, next){

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

          Business.remove({ "_id" : req.body.businessid }, function(err){
            if(err){
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

module.exports = router;
