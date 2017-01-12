class Popup {

	popUp(message){

		let modal = '<div class="c_modal">';
		modal += '<div class="box">';
		modal += '<p>' + message + '</p>';
		modal += '<button id="yes_btn">Yes</button>';
		modal += '<button id="no_btn">No</button>';
		modal += '</div>';
		modal += '</div>';

		$('body').append(modal);

		const thisClass = this;

		$('.c_modal').on('click', function(e){

			if($(e.target).is('.box') || $(e.target).is('button')){
	            e.preventDefault();
	            return;
	        }

			thisClass.popDown();
		});

		$('#yes_btn').on('click', function(){
			thisClass.positiveFunc();
		});
		$('#no_btn').on('click', function(){
			thisClass.negativeFunc();
		});

	}

	popDown(){

		console.log('popdocdcsdwn');
		$('.c_modal').remove();
		$('.c_modal').off();

	}

	constructor(positiveFunc, negativeFunc){
		this.positiveFunc = positiveFunc;
		this.negativeFunc = negativeFunc;
	}

}