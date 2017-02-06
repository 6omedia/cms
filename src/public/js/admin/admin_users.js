// toggle admin permissions

// $('#q_admin').on('click', function(){

// 	if($(this).prop('checked')){
// 		$('#permissionsBox').slideDown(200);
// 	}else{
// 		$('#permissionsBox').slideUp(200);
// 	}

// });

$('#userRole_selected').on('change', function(){

	if($(this).val() == 'admin'){

		$('#permissionsBox').slideDown(200);

	}else{

		$('#permissionsBox').slideUp(200);

	}

});

// toggle change password

$('#q_changepassword').on('click', function(){

	if($(this).prop('checked')){
		$('#passwordBox').slideDown(200);
	}else{
		$('#passwordBox').slideUp(200);
	}

});

const userForm = new Form(forminfo.users_form);

userForm.sendBtn.on('click', function(){

	if($('#q_password').val() != $('#q_passwordconfirm').val()){

		userForm.invalidate(forminfo.users_form.requiredFeilds[2]);
		userForm.invalidate(forminfo.users_form.requiredFeilds[3]);

	}else{

		userForm.sendForm(function(){

			const permArray = [];
			const permlist = $('#permissionsBox ul li input');

			permlist.each(function(){

				let perObj = {
					permission: $(this).val(),
					checked: $(this).is(':checked')					
				}

				permArray.push(perObj);

			});

			// const isAdmin = $('#q_admin').prop('checked');

			$.ajax({
				url: '/admin/api/add_user',
				type: 'POST',
				// dataType: 'json',
				data:
				{
					fullname: userForm.requiredFeilds[0].value,
					email: userForm.requiredFeilds[1].value,
					password: userForm.requiredFeilds[2].value,
					user_role: userForm.requiredFeilds[4].value,
					// isadmin: isAdmin,
					permissions: JSON.stringify(permArray)
				},
				success: function(data)
				{
					userForm.enableSubmit();
					if(data.success == '1'){
						userForm.successBox.html('New User Created').slideDown();
					}else{
						if(data.error){
							// const displayError = makeErrorReadable(data.error);
							if(data.error.code == 11000){
								userForm.errorBox.html('There is already a user with that email').slideDown();	
							}else{
								userForm.errorBox.html('Something went wrong, please try again later...').slideDown();
							}
							
						}else{
							userForm.errorBox.html('Something went wrong, please try again later...').slideDown();
						}
					}
				},
				error: function(xhr, desc, err)
				{
					console.log(xhr, desc, err);
				}
			});

		});

	}

});

userForm.updateBtn.on('click', function(){

	userForm.updateForm(function(){

		let changepassword = false;

		if($('#q_changepassword').is(':checked')){
			changepassword = true;
		}

		const userid = $('#datablock').data('userid');

		const permArray = [];
		const permlist = $('#permissionsBox ul li input');

		permlist.each(function(){

			let perObj = {
				permission: $(this).val(),
				checked: $(this).is(':checked')		
			}

			permArray.push(perObj);

		});

		// const isAdmin = $('#q_admin').prop('checked');

		$.ajax({
			url: '/admin/api/update_user',
			type: 'POST',
			// dataType: 'json',
			data:
			{
				userid: userid,
				fullname: userForm.requiredFeilds[0].value,
				email: userForm.requiredFeilds[1].value,
				changepassword: changepassword,
				password: userForm.requiredFeilds[2].value,
				user_role: userForm.requiredFeilds[4].value,
				// isadmin: isAdmin,
				permissions: JSON.stringify(permArray)
			},
			success: function(data)
			{
				userForm.enableSubmit();

				console.log(data);

				if(data.success == '1'){
					userForm.successBox.html('User Updated').slideDown();
				}else{
					userForm.errorBox.html('Something went wrong, please try again later...').slideDown();
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

	const userid = $('#datablock').data('userid');

	const popup = new Popup(
		// positive
		function(){
			delete_thing('user', userid, '/admin/users', userForm);
		}, 
		// negitive
		function(){
			popup.popDown();
		}
	);

	popup.popUp('Are you sure you want to delete this User?');

});

$('.delete').on('click', function(){

	const userid = $(this).data('userid');

	const popup = new Popup(
		// positive
		function(){
			delete_thing('user', userid, '/admin/users', userForm);
		}, 
		// negitive
		function(){
			popup.popDown();
		}
	);

	popup.popUp('Are you sure you want to delete this Post?');

});