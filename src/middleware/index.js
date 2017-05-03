
var User = require('../models/user');
var dateFormat = require('dateformat');

function loggedOut(req, res, next){
	if(req.session && req.session.userId){
		return res.redirect('/');
	}
	return next();
}

function requiresLogin(req, res, next){
	if(req.session && req.session.userId){
		return next();
	}else{
		res.redirect('/login');
	}
}

function checkUserAdmin(req, res, next){

	if(req.session && req.session.userId){

		User.findById(req.session.userId)
	    .exec(function(error, user){
	      if(error){
	        next(error);
	      }else{

	        // check if admin
	        if(user.user_role == 'admin' || user.user_role == 'super_admin'){
	            
	            req.thisUser = user;
	            return next();

	        }else{
	            return res.redirect('/');
	        }

	      }
	    });

		// return next();
	}else{
		var err = new Error('You must be logged in to view this page');
		err.status = 401;
		res.render('error', {error: err});
	}

}


function getCatsForPost(postCats, categories){

    let catarray = [];
                                   
    for(let i=0; i<categories.length; i++){

        let checked = false;

        for(let j=0; j<postCats.length; j++){

            if(categories[i]._id == postCats[j]){
                checked = true;
            }
        }

        let catObj = {
            catid: categories[i]._id,
            catname: categories[i].term_name,
            checked: checked
        };
        catarray.push(catObj);
    }

    return catarray;
}

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

function formatPostDates(posts){

	for(let i=0; i<posts.length; i++){
        // dateFormat.masks.hammerTime = 'HH:MM! "Can\'t touch this!"';
        posts[i].formatedDate = dateFormat(posts[i].date, "mmmm dS, yyyy");
	}

}

function allTitleCase(inStr){ 
	return inStr.replace(/\w\S*/g, 
	function(tStr) { 
		return tStr.charAt(0).toUpperCase() + tStr.substr(1).toLowerCase(); 
	}); 
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports.loggedOut = loggedOut;
module.exports.requiresLogin = requiresLogin;
module.exports.checkUserAdmin = checkUserAdmin;
module.exports.getCatsForPost = getCatsForPost;
module.exports.give_permission = give_permission;
module.exports.formatPostDates = formatPostDates;
module.exports.capitalizeFirstLetter = capitalizeFirstLetter;
module.exports.allTitleCase = allTitleCase;
// module.exports.imgUpload = imgUpload;