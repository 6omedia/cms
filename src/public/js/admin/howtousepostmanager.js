const addUrl = '/admin/api/add_post';
const updateUrl = '/admin/api/update_post';

const formInfo = {
	sendBtn: $('#send_btn'),
	updateBtn: $('#update_btn'),
	errorBox: $('#error_box'),
	successBox: $('#successBox'),
	spinImg: $('#spin'),
	requiredFeilds: [
		{
			feildName: 'title',
			elem: $('#q_title'),
			value: '',
			error: 'Title required',
			required: true
		},
		{
			feildName: 'slug',
			elem: $('#q_slug'),
			value: '',
			error: 'Slug required',
			required: true
		},
		{
			feildName: 'content',
			elem: $('#q_content'),
			value: '',
			required: false
		},
		{
			feildName: 'Featured Image',
			elem: $('#featImg_container img'),
			value: '',
			required: false
		}
	]
}

const postForm = new Form(formInfo);

const postProductManager = new PostManager(addUrl, updateUrl, 'Post', postForm, '', function(){

	const catArray = this.getCheckedCats();
	const user_id = $('#datablock').data('userid');
	const user_name = $('#datablock').data('username');
	const postid = $('#datablock').data('postid');

	let feat_img = '';
	
	if($('#featImg_container img').attr('src') != undefined){
		feat_img = $('#featImg_container img').attr('src');
	}

	// content blocks

	const useContentBlocks = $('#cb_toggle').prop('checked');
	let theBody = '';

	if(useContentBlocks){

		const contentBlocks = $('#content_block_list li .contentBlock');

		let cbArray = [];

		contentBlocks.each(function(){

			let blocktype = $(this).data('content_type');
			let blockvalue = '';

			if(blocktype == 'Image'){
				blockvalue = $($(this).children()[2]).attr('src');
			}else{
				blockvalue = $($(this).children()[2]).val();
			}

			const cbObj = {
				blocktype: blocktype,
				blockvalue: blockvalue
			};
			cbArray.push(cbObj);
		});

		theBody = JSON.stringify(cbArray); // cbArray stringified

	}else{
		theBody = postForm.requiredFeilds[2].elem.summernote('code');
	}

	const ajaxDataObj = {
		create: {
			// title: postForm.requiredFeilds[0].value
		},
		update: {
			// title: postForm.requiredFeilds[0].value,
			// postid: postid
		}
	}

	return ajaxDataObj;

});