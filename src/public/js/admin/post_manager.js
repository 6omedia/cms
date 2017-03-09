
class PostManager {

	// getCheckedCats('', [])
	getCheckedCats(taxInfo){

		let taxArray = [];

		$(taxInfo).each(function(){

			let currentTax = this;

			let termArray = [];
			let taxObj = {};

			currentTax.ul.each(function(){
				console.log('UL: ', $(this).is(':checked'));
				if($(this).is(':checked')){
					termArray.push($(this).val());
				}
			});

			taxObj = {
				tax_name: currentTax.name,
		 		terms: termArray
			};

			taxArray.push(taxObj);

		});

		return taxArray;
	}

	doAjax(ajax_url, postTypeName, update){

		// let update = false;

		console.log('update ', update);

		let ajax_data = this.getDataToSend(update);

		if(ajax_data == 'invalid'){
			console.log('retuern');
			return;
		}

		if(update){
			ajax_data = ajax_data.update;
		}else{
			ajax_data = ajax_data.create;
		}

		console.log(ajax_data);
		const pManager = this;

		$.ajax({
			url: ajax_url,
			type: 'POST',
			// dataType: 'json',
			data: ajax_data,
			success: function(data)
			{

				console.log('data ', data);

				pManager.postsForm.enableSubmit();
				if(data.success == '1'){
					if(update){
						pManager.postsForm.successBox.html(postTypeName + ' has been updated').slideDown();
					}else{
						pManager.postsForm.successBox.html('New ' + postTypeName + ' Created').slideDown();
					}
				}else{
					if(data.error){
						// const displayError = makeErrorReadable(data.error);
						if(data.error.code == 11000){
							pManager.postsForm.errorBox.html('There is already a ' + postTypeName + ' with that title or slug').slideDown();	
						}else{
							pManager.postsForm.errorBox.html('Something went wrong, please try again later...').slideDown();
						}
						
					}else{
						pManager.postsForm.errorBox.html('Something went wrong, please try again later...').slideDown();
					}
				}
			},
			error: function(xhr, desc, err)
			{
				console.log(xhr, desc, err);
			}
		});

	}

	handleForm(postsForm, addUrl, updateUrl, postTypeName, ajax_data){

		const postManager = this;

		postsForm.sendBtn.on('click', function(){
			postsForm.sendForm(function(){
				postManager.doAjax(addUrl, postTypeName, false);
			});
		});
		
		postsForm.updateBtn.on('click', function(){
			postsForm.updateForm(function(){
				// postManager.doAjax(updateUrl, postTypeName, $('#datablock').data('postid'));
				postManager.doAjax(updateUrl, postTypeName, true);
			});
		});

	}

	handleTaxonomies(){
		// add taxonomy obj array to contructor (Just categories for now)
		// foreach(taxonomy)
			// handle t
	}

	taxonomyBoxToggle(){
		$('.expand_addcatbox').on('click', function(){

			const add_box = $(this).next();

			if(add_box.hasClass('expanded')){
				add_box.removeClass('expanded');
				add_box.slideUp(200);
			}else{
				add_box.addClass('expanded');
				add_box.slideDown(200);
			}
		});
	}

	handleDeletions(delBtnOne, delBtnTwo){

		const thisPm = this;

		delBtnOne.on('click', function(){

			const postid = $('#datablock').data('postid');
			const postType_slug = slugify(thisPm.postTypeName, '_');

			// console.log('postid ', this);
			// console.log('postid ', postid);

			const popup = new Popup(
				// positive
				function(){
					delete_thing(postType_slug, postid, '/admin/' + postType_slug + 's', thisPm.postsForm);
				}, 
				// negitive
				function(){
					popup.popDown();
				}
			);

			popup.popUp('Are you sure you want to delete this ' + thisPm.postTypeName + '?');

		});

		// // Posts Page 

		delBtnTwo.on('click', function(){

			const postid = $(this).data('postid');
			const postType_slug = slugify(thisPm.postTypeName, '_');

			const popup = new Popup(
				// positive
				function(){
					delete_thing(postType_slug, postid, '/admin/' + postType_slug + 's', thisPm.postsForm);
				}, 
				// negitive
				function(){
					popup.popDown();
				}
			);

			popup.popUp('Are you sure you want to delete this ' + thisPm.postTypeName + '?');

		});

	}

	init(){

		$('#q_title').on('blur', function(){
			const slug = slugify($(this).val(), '-');
			$('#q_slug').val(slug);
		});

		$('#q_slug').on('blur', function(){
			const slug = slugify($('#q_slug').val(), '-');
			$('#q_slug').val(slug);
		});

		this.handleForm(this.postsForm, this.addPost_Url, this.updatePost_url, this.postTypeName, this.ajax_data);
		this.handleDeletions($('#delete_btn'), $('.delete'));
		this.taxonomyBoxToggle();

	}

	constructor(addPost_Url, updatePost_url, postTypeName, form, ajax_data, getDataToSend){
		this.addPost_Url = addPost_Url;
		this.updatePost_url = updatePost_url;
		this.postTypeName = postTypeName;
		this.postsForm = form;
		this.ajax_data = ajax_data;
		this.getDataToSend = getDataToSend;
		// this.createDataToSend = getDataToSend.create;
		// this.updateDataToSend = getDataToSend.update;
		this.init();
	}

}










