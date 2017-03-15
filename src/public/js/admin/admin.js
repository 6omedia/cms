
// Global Variables

const useAws = false;


function slugify(string, space){

	let slug = string
		.replace(/[^\w ]+/g,'')
		.replace(/ +/g, space);

	return slug;

}

// CRUD AJAX CALLS

function delete_thing(delete_item, itemid, relocateUrl, formObj, norefreshFunc){

	$.ajax({
		url: '/admin/api/delete',
		type: 'POST',
		// dataType: 'json',
		data:
		{
			delete_item: delete_item,
			itemid: itemid
		},
		success: function(data)
		{
			console.log(data);
			formObj.enableSubmit();
			if(data.success == '1'){

				if(!norefreshFunc){

					if(relocateUrl == ''){
						window.location.reload();
					}else{
						window.location.replace(relocateUrl);
					}

				}else{
					norefreshFunc();
				}

			}else{
				$('.c_modal').remove();
				$('.c_modal').off();
				formObj.errorBox.html(data.error).slideDown();
			}
		},
		error: function(xhr, desc, err)
		{
			console.log(xhr, desc, err);
		}
	});

} 
