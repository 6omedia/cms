class ImageUploader {

 	resetProgress(){
 		$('.progress-bar').text('0%');
    	$('.progress-bar').width('0%');
	}

	uploadFiles(successFunc){
		var files = this.fileInput.get(0).files;

		if (files.length > 0){

			var formData = new FormData();

			for (var i = 0; i < files.length; i++) {
	  			var file = files[i];
			  	formData.append('uploads[]', file, file.name);
			}

			$.ajax({
				url: '/admin/api/upload',
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
			            $('.progress-bar').text(percentComplete + '%');
			            $('.progress-bar').width(percentComplete + '%');

			            // once the upload reaches 100%, set the progress bar text to done
			            if (percentComplete === 100) {
			            	$('.progress-bar').html('Done');
			            }

			          }

			        }, false);

			        return xhr;
				}
			});

		}
	}

	constructor(fileInput, uploadBtn){
		this.fileInput = fileInput;
		this.uploadBtn = uploadBtn;
	}

}