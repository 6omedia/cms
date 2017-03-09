// /* Categories Could put code below in own category.js */

// $('.expand_addcatbox').on('click', function(){

// 	$('.addcatbox').slideDown(200);

// });

// const catsForm = new Form(forminfo.cats_form);

// catsForm.sendBtn.on('click', function(){
// 	catsForm.sendForm(function(){

// 		$.ajax({
// 			url: '/admin/api/add_cat',
// 			type: 'POST',
// 			// dataType: 'json',
// 			data:
// 			{
// 				name: catsForm.requiredFeilds[0].value,
// 				description: catsForm.requiredFeilds[1].value
// 			},
// 			success: function(data)
// 			{
// 				catsForm.enableSubmit();
// 				if(data.success == '1'){

// 					catsForm.successBox.html('Category Created').slideDown();

// 					console.log(data);
					
// 					let newCat = `
// 						<li>
// 							<input type="checkbox" value="${data.catid}">
// 							<label>${data.catname}</label>
// 							<ul class="list">
// 								<li>
// 									<span class="delbtn deletecat" data-catid="${data.catid}">Delete</span>
// 								</li>
// 								<li>
// 									<a>Edit</a>
// 								</li>
// 							</ul>
// 						</li>
// 					`;

// 					// let newCat = '<li>';
// 					// newCat += '<input type="checkbox" value="' + data.catid + '">';
// 					// newCat += '<label>' + data.catname + '</label>';
// 					// newCat += '<ul class="list">';
// 					// newCat += '<li>';
// 					// newCat += '<span class="delbtn deletecat" data-catid="' + data.catid + '">Delete</span>';
// 					// newCat += '</li>';
// 					// newCat += '<li>';
// 					// newCat += '<a>Edit</a>';
// 					// newCat += '</li>';
// 					// newCat += '</ul>';
// 					// newCat += '</li>';

// 					$('.categories').prepend(newCat);

// 				}else{
// 					if(data.error){
// 						// const displayError = makeErrorReadable(data.error);
// 						if(data.error.code == 11000){
// 							catsForm.errorBox.html('There is already a category with that name').slideDown();	
// 						}else{
// 							catsForm.errorBox.html('Something went wrong, please try again later...').slideDown();
// 						}
						
// 					}else{
// 						catsForm.errorBox.html('Something went wrong, please try again later...').slideDown();
// 					}
// 				}
// 			},
// 			error: function(xhr, desc, err)
// 			{
// 				console.log(xhr, desc, err);
// 			}
// 		});

// 	});
// });

// $('body').on('click', '.deletecat', function(){

// 	const catid = $(this).data('catid');
// 	const thisli = $(this).parent().parent().parent();

// 	const popup = new Popup(
// 		// positive
// 		function(){
// 			delete_thing('category', catid, '', catsForm, function(){
// 				thisli.remove();
// 				popup.popDown();
// 			});
// 		},
// 		// negitive
// 		function(){
// 			popup.popDown();
// 		}
// 	);

// 	popup.popUp('Are you sure you want to delete this Category?');

// });