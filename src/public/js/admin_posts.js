
function getCheckedCats() {
	let catArray = [];
	const catlis = $('.categories li input');

	catlis.each(function(){

		if($(this).is(':checked')){
			catArray.push($(this).val());
		}

	});

	return catArray;
}

$('#q_title').on('blur', function(){
	const slug = slugify($(this).val());
	$('#q_slug').val(slug);
});

$('#q_slug').on('blur', function(){
	const slug = slugify($('#q_slug').val());
	$('#q_slug').val(slug);
});


const postsForm = new Form(forminfo.posts_form);

postsForm.sendBtn.on('click', function(){
	postsForm.sendForm(function(){

		const catArray = getCheckedCats();
		const user_id = $('#datablock').data('userid');

		$.ajax({
			url: '/admin/api/add_post',
			type: 'POST',
			// dataType: 'json',
			data:
			{
				title: postsForm.requiredFeilds[0].value,
				slug: postsForm.requiredFeilds[1].value,
				body: postsForm.requiredFeilds[2].elem.summernote('code'),
				categories: JSON.stringify(catArray),
				user_id: user_id
			},
			success: function(data)
			{
				postsForm.enableSubmit();
				if(data.success == '1'){
					postsForm.successBox.html('New Post Created').slideDown();
				}else{
					if(data.error){
						// const displayError = makeErrorReadable(data.error);
						if(data.error.code == 11000){
							postsForm.errorBox.html('There is already a post with that title or slug').slideDown();	
						}else{
							postsForm.errorBox.html('Something went wrong, please try again later...').slideDown();
						}
						
					}else{
						postsForm.errorBox.html('Something went wrong, please try again later...').slideDown();
					}
				}
			},
			error: function(xhr, desc, err)
			{
				console.log(xhr, desc, err);
			}
		});

	});

});



// Updateing a post

postsForm.updateBtn.on('click', function(){

	postsForm.updateForm(function(){

		const postid = $('#datablock').data('postid');

		const catArray = getCheckedCats();

		$.ajax({
			url: '/admin/api/update_post',
			type: 'POST',
			// dataType: 'json',
			data:
			{
				postid: postid,
				title: postsForm.requiredFeilds[0].value,
				slug: postsForm.requiredFeilds[1].value,
				categories: JSON.stringify(catArray)
			},
			success: function(data)
			{
				postsForm.enableSubmit();

				console.log(data);

				if(data.success == '1'){
					postsForm.successBox.html('Post Updated').slideDown();
				}else{
					postsForm.errorBox.html('Something went wrong, please try again later...').slideDown();
				}
			},
			error: function(xhr, desc, err)
			{
				console.log(xhr, desc, err);
			}
		});

	});

});


$('#delete_btn').on('click', function(){

	const postid = $('#datablock').data('postid');

	const popup = new Popup(
		// positive
		function(){
			delete_thing('post', postid, '/admin/posts', postsForm);
		}, 
		// negitive
		function(){
			popup.popDown();
		}
	);

	popup.popUp('Are you sure you want to delete this Post?');

});

// Posts Page 

$('.delete').on('click', function(){

	const postid = $(this).data('postid');

	const popup = new Popup(
		// positive
		function(){
			delete_thing('post', postid, '/admin/posts', postsForm);
		}, 
		// negitive
		function(){
			popup.popDown();
		}
	);

	popup.popUp('Are you sure you want to delete this Post?');

});


/* Categories Could put code below in own category.js */

$('.expand_addcatbox').on('click', function(){

	$('.addcatbox').slideDown(200);

});

const catsForm = new Form(forminfo.cats_form);

catsForm.sendBtn.on('click', function(){
	catsForm.sendForm(function(){

		$.ajax({
			url: '/admin/api/add_cat',
			type: 'POST',
			// dataType: 'json',
			data:
			{
				name: catsForm.requiredFeilds[0].value,
				description: catsForm.requiredFeilds[1].value
			},
			success: function(data)
			{
				catsForm.enableSubmit();
				if(data.success == '1'){

					catsForm.successBox.html('Category Created').slideDown();

					console.log(data);
					
					let newCat = '<li>';
					newCat += '<input type="checkbox">';
					newCat += '<label>' + data.catname + '</label>';
					newCat += '<ul class="list">';
					newCat += '<li>';
					newCat += '<span class="delbtn deletecat" data-catid="' + data.catid + '">Delete</span>';
					newCat += '</li>';
					newCat += '<li>';
					newCat += '<a>Edit</a>';
					newCat += '</li>';
					newCat += '</ul>';
					newCat += '</li>';

					$('.categories').prepend(newCat);

					// window.location.reload();

					// $.ajax({
					// 	url: '/admin/api/get_cats',
					// 	type: 'POST',
					// 	// dataType: 'json',
					// 	data:
					// 	{
					// 		name: catsForm.requiredFeilds[0].value,
					// 		description: catsForm.requiredFeilds[1].value
					// 	},
					// 	success: function(data)
					// 	{
					// 		console.log(data);
					// 		$('.categories').empty();
							
					// 		let string = '';

					// 		for(let i=0; i<data.length; i++){

					// 			string += '<li>';
					// 			string += '<input type="checkbox">';
					// 			string += '<label>' + data[i].name + '</label>';
					// 			string += '<ul class="list">';
					// 			string += '<li>';
					// 			string += '<span class="delbtn deletecat" data-catid="' + data[i]._id + '">Delete</span>';
					// 			string += '</li>';
					// 			string += '<li>';
					// 			string += '<a>Edit</a>';
					// 			string += '</li>';
					// 			string += '</ul>';
					// 			string += '</li>';

					// 		}

					// 		$('.categories').append(string);
					// 	},
					// 	error: function(xhr, desc, err)
					// 	{
					// 		console.log(xhr, desc, err);
					// 	}
					// });

				}else{
					if(data.error){
						// const displayError = makeErrorReadable(data.error);
						if(data.error.code == 11000){
							catsForm.errorBox.html('There is already a category with that name').slideDown();	
						}else{
							catsForm.errorBox.html('Something went wrong, please try again later...').slideDown();
						}
						
					}else{
						catsForm.errorBox.html('Something went wrong, please try again later...').slideDown();
					}
				}
			},
			error: function(xhr, desc, err)
			{
				console.log(xhr, desc, err);
			}
		});

	});
});

$('body').on('click', '.deletecat', function(){

	const catid = $(this).data('catid');
	const thisli = $(this).parent().parent().parent();

	const popup = new Popup(
		// positive
		function(){
			delete_thing('category', catid, '', catsForm, function(){
				thisli.remove();
				popup.popDown();
			});
		},
		// negitive
		function(){
			popup.popDown();
		}
	);

	popup.popUp('Are you sure you want to delete this Category?');

});
