
	/*

		class definitions

	*/

	class ContentBlock {

		render(){

		    const li = $(document.createElement('li'));
		    const div = $(document.createElement('div')).addClass('contentBlock').data('content_type', this.type);
		    const h4 = $(document.createElement('h4')).html(this.type);
		    const remove = $(document.createElement('div')).addClass('remove').html('x');

		    div.append(h4);
		    div.append(remove);

		    switch(this.type) {
			    case 'Plain Text':
			        const txtArea = $(document.createElement('textarea')).attr('placeholder', "type text here...");
			        div.append(txtArea);
			        break;
			    case 'HTML':
			    	const htmlArea = $(document.createElement('textarea'))
			    						.attr('placeholder', "type html here...")
			    						.addClass('htmlEdit');
			        div.append(htmlArea);
			        break;
			    case 'Image':
			    	const img = $(document.createElement('img')).hide();
			    	const fileInput = $(document.createElement('input')).attr('type', 'file');
			    	const prog = $(document.createElement('div')).addClass('progress');
			    	const progBar = $(document.createElement('div')).addClass('progress-bar')
			    						.attr('role', 'progressbar');
			    	prog.append(progBar);
			    	div.append(img);
			    	div.append(fileInput);
			    	div.append(prog);

			    	this.attachImgUploader(img, progBar, fileInput);

			        break;
			    case 'Video':
			    	const vid_input = $(document.createElement('input')).attr('type', 'text');
			   		div.append(vid_input);
			        break;
			    default:
			        console.log('Not a content type');
			}

			li.append(div);
		
			this.ul.append(li);

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

		}

		attachImgUploader(img, prog, fileInput){

			const uploader = new ImageUploader(fileInput, '', prog, 'posts', this.aws);

			uploader.fileInput.on('click', function(){
				uploader.resetProgress();	
			});

			uploader.fileInput.on('change', function(){

				if(uploader.awsObj == false){

					uploader.uploadLocalFiles(function(data){
						img.attr('src', '/static/uploads/posts/' + data.filename).show();
					});

				}else{

					uploader.uploadFile(function(awsUrl, filename){
						img.attr('src', awsUrl).show();
					});

				}

			});

		}

		constructor(ul, type, aws){
			this.ul = ul;
			this.type = type;
			this.aws = aws;
		}
	}

	class CbControls {

		addContentBlock(contentBlock){
			const cBlock = new ContentBlock(this.cbList, contentBlock, this.aws);
			cBlock.render();
		}

		removeContentBlock(contentBlock){
			console.log('remove');
		}

		createButtons(cbTypes){

			for(let i=0; i<cbTypes.length; i++){
				const button = '<li data-cb_type="' + cbTypes[i] + '">' + cbTypes[i] + '</li>';
				this.ul.append(button);
			}

			const btns = this.ul.children('li');
			const thisObj = this;

			btns.on('click', function(){
				const type = $(this).data('cb_type');
				thisObj.addContentBlock(type);
			});

		}

		attachImgUploaders(){
			const aws = this.aws;
			const contentBlocks = this.cbList.children();
			contentBlocks.each(function(){
				let div = $(this).children();
				if(div.data('content_type') == 'Image'){

					const img = div.children('img');

					const uploader = new ImageUploader(div.children('input'), '', div.children('.progress'), 'posts', aws);

					uploader.fileInput.on('click', function(){
						uploader.resetProgress();	
					});

					uploader.fileInput.on('change', function(){

						if(uploader.awsObj == false){

							uploader.uploadLocalFiles(function(data){
								img.attr('src', '/static/uploads/posts/' + data.filename).show();
							});

						}else{

							uploader.uploadFile(function(awsUrl, filename){
								img.attr('src', awsUrl).show();
							});

						}

					});
				}
			});
		}

		constructor(cbList, ul, aws){
			this.contentBlocks = [];
			this.cbList = cbList;
			this.ul = ul;
			this.cbList.sortable();
			this.attachImgUploaders();
			this.aws = aws;
		}
	}
