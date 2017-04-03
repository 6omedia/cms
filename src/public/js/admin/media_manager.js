class MediaManager{

	removeMedia(fileName){

		const mediaType = this.mediaType;
		const folder = this.folder;

		const removePopup = new Popup(
			function(){
				
				$.ajax({
					url: '/admin/api/media/remove',
					type: 'POST',
					// dataType: 'json',
					data:
					{
						fileName: fileName,
						folder: folder
					},
					success: function(data)
					{
						console.log(data);
						if(data.success == '1'){
							window.location.reload();
						}
					},
					error: function(xhr, desc, err)
					{

					}
				});

			},
			function(){
				
				this.popDown();
			
			}
		);

		removePopup.popUp('Are you sure you want to remove this ' + mediaType + ' from the server?');

	}

	addMedia(){
		
	}

	popUp(){

		
		
	}

	openMedia(){
		
		// popup box with media list
		// on select higlight that media item
		// on select btn click, pop down and insert into post

	}

	constructor(mediaType, folder){
		this.mediaType = mediaType;
		this.folder = folder;
	}

}