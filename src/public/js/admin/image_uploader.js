class ImageUploader {

 	resetProgress(){
 		this.progBar.text('0%');
    	this.progBar.width('0%');
	}

	generateUrl(callback){

		const fullPath = this.fileInput.val();
		let filename = '';

		if (fullPath) {
		    
		    var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
		    filename = fullPath.substring(startIndex);
		    
		    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
		        filename = filename.substring(1);
		    }

		}

		$.ajax({
			url: '/admin/api/generate_s3_url',
			type: 'POST',
			// dataType: 'json',
			data:
			{
				imgName: filename
			},
			success: function(data)
			{
				console.log(data);
				callback(data, filename);
			},
			error: function(xhr, desc, err)
			{

			}
		});

	}

	uploadFile(callback){

		const fileInput = this.fileInput;
		let progThis = this;

		this.generateUrl(function(data, filename){

			var theFormFile = fileInput.get()[0].files[0];

			$.ajax({
				type: 'PUT',
				url: data.uploadPreSignedUrl,
				// Content type must much with the parameter you signed your URL with
				contentType: 'binary/octet-stream',
				// this flag is important, if not set, it will try to send data as a form
				processData: false,
				// the actual file is sent raw
				data: theFormFile,
				success: function()
				{
					callback(data.downloadPreSignedUrl, filename);
					console.log('File uploaded');
				},
				error: function(xhr, desc, err)
				{
					console.log(xhr, desc, err);
					console.log('File NOT uploaded');
			        // console.log( arguments);
				},
				xhr: function() {
			        // create an XMLHttpRequest
			        var xhr = new XMLHttpRequest();

			        // listen to the 'progress' event
			        xhr.upload.addEventListener('progress', function(evt) {

			          if (evt.lengthComputable) {
			            // calculate the percentage of upload completed
			            var percentComplete = evt.loaded / evt.total;
			            percentComplete = parseInt(percentComplete * 100);

			            // update the Bootstrap progress bar with the new percentage
			            progThis.progBar.text(percentComplete + '%');
			            progThis.progBar.width(percentComplete + '%');

			            // once the upload reaches 100%, set the progress bar text to done
			            if (percentComplete === 100) {
			            	progThis.progBar.html('Done');
			            }

			          }

			        }, false);

			        return xhr;
				}
		    });

		});

	}

	uploadLocalFiles(successFunc){

		var files = this.fileInput.get(0).files;

		let progThis = this;

		if (files.length > 0){

			var formData = new FormData();

			for (var i = 0; i < files.length; i++) {
	  			var file = files[i];
			  	formData.append('uploads[]', file, file.name);
			}

			$.ajax({
				url: '/admin/api/upload/' + this.subFolder,
				type: 'POST',
				data: formData,
				processData: false,
				contentType: false,
				success: function(data){
					
					successFunc(data);

				},
				xhr: function() {
			        // create an XMLHttpRequest
			        var xhr = new XMLHttpRequest();

			        // listen to the 'progress' event
			        xhr.upload.addEventListener('progress', function(evt) {

			          if (evt.lengthComputable) {
			            // calculate the percentage of upload completed
			            var percentComplete = evt.loaded / evt.total;
			            percentComplete = parseInt(percentComplete * 100);

			            // update the Bootstrap progress bar with the new percentage
			            progThis.progBar.text(percentComplete + '%');
			            progThis.progBar.width(percentComplete + '%');

			            // once the upload reaches 100%, set the progress bar text to done
			            if (percentComplete === 100) {
			            	progThis.progBar.html('Done');
			            }

			          }

			        }, false);

			        return xhr;
				}
			});

		}
	}

	constructor(fileInput, uploadBtn, progBar, subFolder, awsObj){
		this.fileInput = fileInput;
		this.uploadBtn = uploadBtn;
		this.progBar = progBar;
		this.subFolder = subFolder;
		this.awsObj = awsObj;
	}

}