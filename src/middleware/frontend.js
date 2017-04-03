
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

function createPaginationLinks(docsPerPage, pageNumber, url, count){

	let pageCount = Math.ceil(count / docsPerPage);

	let links = [];

	if(pageNumber > 1){
		links.push(`<a class="prev" href="">&#8592;</a>`);
	}

	for(let i=0; i<pageCount; i++){

		let pageNum = i + 1;
		let linkUrl = url + '/' + pageNum;
		
		if(pageNumber == pageNum){
			links.push(`<a href="${linkUrl}" class="current_page">${pageNum}</a>`);
		}else{
			links.push(`<a href="${linkUrl}">${pageNum}</a>`);
		}

	};

	if(pageNumber < pageCount){
		links.push(`<a class="next" href="">&#8594;</a>`);
	}

	return links;

}

module.exports.createPaginationLinks = createPaginationLinks;
module.exports.increaseViewCount = increaseViewCount;