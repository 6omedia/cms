
const imgManager = new MediaManager('image', 'posts');
const videoManager = new MediaManager('video', 'videos');

$('.mediaFilesList .remove').on('click', function(){

	console.log('cndjis ', $(this).data('type'));	

	if($(this).data('type') == 'images'){
	
		imgManager.removeMedia($(this).data('filename'));

	}else if($(this).data('type') == 'videos'){

		videoManager.removeMedia($(this).data('filename'));

	}

});