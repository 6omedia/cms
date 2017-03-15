
var Post = require('../models/post');

function increaseViewCount(contentType, postid) {
    
	console.log('In func');

	switch(contentType) {

		case 'post':

			// console.log('In post');

			// update post
			Post.update(
		        {
		        	"_id": postid
		        }, 
		        {
		            $inc: {
		                view_count: 1
		            }
		        },
		        function(err, affected, resp){
		            if(err){
		            	// console.log('error');
		                return err;
		            }else{
		            	console.log('all should be good: ', resp);
		                return true;
		            }
		        }
		    );

			break;
		default:
			// console.log('default');
			return;

	}

}

module.exports.increaseViewCount = increaseViewCount;