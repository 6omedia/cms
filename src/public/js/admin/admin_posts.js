
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
			feildName: 'meta description',
			elem: $('#q_metadescription'),
			value: '',
			error: 'meta description required',
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

const controls = new CbControls($('#content_block_list'), $('.post_section_menu'), useAws);

const types = [
	'H2',
	'H3',
	'Paragraph',
	'Quote',
	'Horizontal Rule',
	'Preface',
	'Image',
	'HTML',
	'Gallery',
	'Video'
];

controls.createButtons(types);

const postProductManager = new PostManager(addUrl, updateUrl, 'Post', postForm, '', function(){

	const taxInfo = [
		{
			name: 'Categories',
			ul: $('#category_list li input')
		}
	];

	const catArray = this.getCheckedCats(taxInfo);

	// console.log('catArray: ', catArray);

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

			switch(blocktype){

				case 'Preface':
					blockvalue = {};

					blockvalue.title = $($(this).children()[2]).val();
					blockvalue.summary = $($(this).children()[3]).val();
					blockvalue.img = $($(this).children()[4]).attr('src');

					break;

				case 'Image':
				case 'Video':
					blockvalue = $($(this).children()[2]).attr('src');

					break;

				case 'Horizontal Rule':
					blockvalue = 'hr';

					break;

				default:
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
		theBody = postForm.requiredFeilds[3].elem.summernote('code');
	}

	const ajaxDataObj = {
		create: {
			title: postForm.requiredFeilds[0].value,
			slug: postForm.requiredFeilds[1].value,
			meta_description: postForm.requiredFeilds[2].value,
			body: theBody,
			categories: JSON.stringify(catArray),
			feat_img: feat_img,
			user_id: user_id,
			user_name: user_name,
			date: new Date()
		},
		update: {
			title: postForm.requiredFeilds[0].value,
			slug: postForm.requiredFeilds[1].value,
			meta_description: postForm.requiredFeilds[2].value,
			body: theBody,
			categories: JSON.stringify(catArray),
			feat_img: feat_img,
			postid: postid
		}
	}

	return ajaxDataObj;

});

function displayUploadedImg(imgLink){

	const imgTag = '<img src="' + imgLink + '">';
	$('#featImg_container').append(imgTag);
	$('#featImg_container > p').remove();
	$('#upload_box').hide();

}

const imgUploader = new ImageUploader($('#upload-input'), $('#upload_btn'), $('#feat_img_prog'), 'posts', useAws);

imgUploader.fileInput.on('click', function(){
	imgUploader.resetProgress();
});

imgUploader.uploadBtn.on('click', function(){

	if(imgUploader.awsObj == false){

		imgUploader.uploadLocalFiles(function(data){
			displayUploadedImg('/static/uploads/posts/' + data.filename);
		});

	}else{

		imgUploader.uploadFile(function(awsUrl, filename){
			displayUploadedImg(awsUrl);
		});

	}

});

// #selectImgBtn

const imgManager = new MediaManager('image', 'posts');

$('#selectImgBtn').on('click', function(){

	imgManager.openMedia(function(imgUrl){

		console.log(imgUrl);

	});

});

$('#remove_img').on('click', function(){
	$(this).next().remove();
	$('#upload_box').show();
	imgUploader.resetProgress();
	$('#upload-input').val('');
});


// Content Type Toggle

$('#cb_toggle').on('click', function(){

	if($(this).prop('checked')){
		$('#q_content').summernote('destroy');
		$('#q_content').hide();
		$('#cb').show();
	}else{
		$('#q_content').summernote({
	    	height: 300
	    });
	    $('#cb').hide();
	}

});

$('.contentBlock .remove').on('click', function(){
	$(this).parent().parent().remove();
});

$('.htmlEdit').keydown(function (e){
    var keycode1 = (e.keyCode ? e.keyCode : e.which);
    if (keycode1 == 0 || keycode1 == 9) {
        e.preventDefault();
        e.stopPropagation();
    }
});



// Categories...

const catsInfo = {
	sendBtn: $('#add_cat'),
	updateBtn: $('#update_cat'),
	errorBox: $('#cats_err'),
	successBox: $('#cats_success'),
	spinImg: $('#cats_spin'),
	requiredFeilds: [
		{
			feildName: 'Category title',
			elem: $('#q_catname'),
			value: '',
			error: 'Title required',
			required: true
		},
		{
			feildName: 'Category Description',
			elem: $('#q_cat_description'),
			value: '',
			required: false
		},
		{
			feildName: 'Category Parent',
			elem: $('#q_cat_parent'),
			value: '',
			required: false
		}
	]
}

const categoryForm = new Form(catsInfo);
const category = new Taxonomy('Categories', categoryForm, $('#category_list'));