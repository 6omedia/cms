const formFeilds = {
	sendBtn: $('#add_term'),
	updateBtn: $('#update_btn'),
	errorBox: $('#term_err'),
	successBox: $('#term_success'),
	spinImg: $('#spin'),
	requiredFeilds: [
		{
			feildName: 'name',
			elem: $('#q_term_name'),
			value: '',
			error: 'Term Name Required',
			required: true
		},
		{
			feildName: 'description',
			elem: $('#q_term_description'),
			value: '',
			error: 'Slug required',
			required: false
		},
		{
			feildName: 'parent',
			elem: $('#q_term_parent'),
			value: '',
			error: 'Slug required',
			required: false
		}
	]
}

const termForm = new Form(formFeilds);

termForm.sendBtn.on('click', function(){
	termForm.sendForm(function(){

		console.log('njk');

		const termName = $('#q_term_name').val();
		const termDescription = $('#q_term_description').val();
		let termParent = $('#q_term_parent').val();

		if(termParent == ''){
			termParent = '0';
		}

		$.ajax({
			url: '/admin/api/add_term',
			type: 'POST',
			// dataType: 'json',
			data:
			{
				taxonomy: $('#datablock').data('taxonomy'),
				name: termName,
				description: termDescription,
				parent: termParent
			},
			success: function(data)
			{
				console.log('success ', data);
				window.location.reload();
				// this.add_term_to_list(data.term);
			},
			error: function(xhr, desc, err)
			{

			}
		});
	});
});

$('.x').on('click', function(){

	termForm.disableSubmit();

	const postid = $(this).data('termid');
	$.ajax({
		url: '/admin/api/delete',
		type: 'POST',
		// dataType: 'json',
		data:
		{
			delete_item: 'term',
			itemid: postid,
			taxonomy_name: $('#datablock').data('taxonomy')
		},
		success: function(data)
		{
			console.log(data);
			// termForm.enableSubmit();
			if(data.success == '1'){

				window.location.reload();

			}else{
				// $('.c_modal').remove();
				// $('.c_modal').off();
				formObj.errorBox.html(data.error).slideDown();
			}
		},
		error: function(xhr, desc, err)
		{
			console.log(xhr, desc, err);
		}
	});

});
