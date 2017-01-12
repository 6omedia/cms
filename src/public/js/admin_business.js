
const businessForm = new Form(forminfo.business_form);

// Adding a new Business

businessForm.sendBtn.on('click', function(){
	businessForm.sendForm(function(){

		$.ajax({
			url: '/admin/api/add_business',
			type: 'POST',
			// dataType: 'json',
			data:
			{
				name: businessForm.requiredFeilds[0].value,
				website: businessForm.requiredFeilds[1].value,
				phone: businessForm.requiredFeilds[2].value,
				email: businessForm.requiredFeilds[3].value,
				fladdress: businessForm.requiredFeilds[4].value,
				town: businessForm.requiredFeilds[5].value,
				postcode: businessForm.requiredFeilds[6].value,
				industry: businessForm.requiredFeilds[7].value,
				openinghours: businessForm.requiredFeilds[8].value,
				serv1: businessForm.requiredFeilds[9].value,
				serv2: businessForm.requiredFeilds[10].value,
				serv3: businessForm.requiredFeilds[11].value,
				facebook: businessForm.requiredFeilds[12].value,
				twitter: businessForm.requiredFeilds[13].value,
				instagram: businessForm.requiredFeilds[14].value,
				youtube: businessForm.requiredFeilds[15].value,
				linkedin: businessForm.requiredFeilds[16].value
			},
			success: function(data)
			{
				businessForm.enableSubmit();
				if(data.success == '1'){
					businessForm.successBox.html('New Business Created').slideDown();
				}else{
					businessForm.errorBox.html('Something went wrong, please try again later...').slideDown();
				}
			},
			error: function(xhr, desc, err)
			{
				console.log(xhr, desc, err);
			}
		});

	});

});


// Updateing a business

businessForm.updateBtn.on('click', function(){

	businessForm.updateForm(function(){

		const businessid = $('#datablock').data('businessid');

		$.ajax({
			url: '/admin/api/update_business',
			type: 'POST',
			// dataType: 'json',
			data:
			{
				businessid: businessid,
				name: businessForm.requiredFeilds[0].value,
				website: businessForm.requiredFeilds[1].value,
				phone: businessForm.requiredFeilds[2].value,
				email: businessForm.requiredFeilds[3].value,
				fladdress: businessForm.requiredFeilds[4].value,
				town: businessForm.requiredFeilds[5].value,
				postcode: businessForm.requiredFeilds[6].value,
				industry: businessForm.requiredFeilds[7].value,
				openinghours: businessForm.requiredFeilds[8].value,
				serv1: businessForm.requiredFeilds[9].value,
				serv2: businessForm.requiredFeilds[10].value,
				serv3: businessForm.requiredFeilds[11].value,
				facebook: businessForm.requiredFeilds[12].value,
				twitter: businessForm.requiredFeilds[13].value,
				instagram: businessForm.requiredFeilds[14].value,
				youtube: businessForm.requiredFeilds[15].value,
				linkedin: businessForm.requiredFeilds[16].value
			},
			success: function(data)
			{
				businessForm.enableSubmit();
				if(data.success == '1'){
					businessForm.successBox.html('Business Updated').slideDown();
				}else{
					businessForm.errorBox.html('Something went wrong, please try again later...').slideDown();
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

	const businessid = $('#datablock').data('businessid');

	const popup = new Popup(
		// positive
		function(){
			delete_thing('business', businessid, '/admin/businesses', businessForm);
		}, 
		// negitive
		function(){
			popup.popDown();
		}
	);

	popup.popUp('Are you sure you want to delete this Business?');

});

// Businesses Page 

$('.delete').on('click', function(){

	const businessid = $(this).data('businessid');

	const popup = new Popup(
		// positive
		function(){
			delete_thing('business', businessid, '/admin/businesses', businessForm);
		}, 
		// negitive
		function(){
			popup.popDown();
		}
	);

	popup.popUp('Are you sure you want to delete this Post?');

});
