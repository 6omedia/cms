
function loggedOut(req, res, next){
	if(req.session && req.session.userId){
		return res.redirect('/profile');
	}
	return next();
}

function requiresLogin(req, res, next){
	if(req.session && req.session.userId){
		return next();
	}else{
		var err = new Error('You must be logged in to view this page');
		err.status = 401;
		res.render('error', {error: err});
	}
}

// function imgUpload(req, res, next){ 

// 	if(req.session && req.session.userId){
	
// 		var uploading = multer({
// 			// dest: __dirname + '../public/uploads/',
// 			dest: '/static/public/uploads'
// 		});
// 		return next();
	
// 	}else{
// 		var err = new Error('You must be logged in to view this page');
// 		err.status = 401;
// 		res.render('error', {error: err});
// 	}
// }

module.exports.loggedOut = loggedOut;
module.exports.requiresLogin = requiresLogin;
// module.exports.imgUpload = imgUpload;