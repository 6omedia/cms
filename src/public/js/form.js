/*

	Class: Form

	example of data to pass to constructor 

	const data = {
		sendBtn: $('#send_btn'),
		errorBox: $('#error_box'),
		successBox: $('#successBox'),
		spinImg: '/img/spin.png',
		requiredFeilds: [
			{
				feildName: 'name',
				elem: $('#q_name'),
				value: '',
				error: 'Business Name required',
				required: true
			},
			{
				feildName: 'phone',
				elem: $('#q_phone'),
				value: '',
				error: 'Phone number required',
				required: true
			}
		]
	}

*/


class Form {
	
	/*

		Pass callback function in here which has the ajax call

	*/

	sendForm(callback){
		this.resetValidation();
		const valid = this.isFormValid(this.requiredFeilds);
		if(valid){
			this.disableSubmit();
			callback();
		}
	}

	updateForm(callback){
		// LOOP THROUGH REQUIRED FEILDS AND ADD THE VALUES!!!
		const feildsLength = this.requiredFeilds.length;

		for(let i = 0; i < feildsLength; i++){
			this.requiredFeilds[i].value = this.requiredFeilds[i].elem.val();
		}

		callback();
	}

	disableSubmit(){
		this.sendBtn.hide();
		this.updateBtn.hide();
	}

	enableSubmit(){
		this.sendBtn.show();
		this.updateBtn.show();
	}

	isFormValid(requiredFeilds){

		const length = requiredFeilds.length;
		let valid = true;

		for(let i=length-1; i >= 0; i--){

			let currentFeild_value = requiredFeilds[i].elem.val();

			if(requiredFeilds[i].required){

				if(currentFeild_value != ""){
					requiredFeilds[i].value = currentFeild_value;
				}else{
					this.invalidate(requiredFeilds[i]);
					valid = false;
				}

			}else{
				requiredFeilds[i].value = currentFeild_value;
			}

		}

		return valid;

	}

	invalidate(feildObj){
		feildObj.elem.addClass('invalid');
		this.errorBox.html(feildObj.error).slideDown(400);
	}

	resetValidation(){

		this.errorBox.html('').slideUp();

		const length = this.requiredFeilds.length;
		for(let i=0; i< length; i++){
			this.requiredFeilds[i].elem.removeClass('invalid');
		}

	}

	constructor(data){
		this.sendBtn = data.sendBtn;
		this.updateBtn = data.updateBtn;
		this.errorBox = data.errorBox;
		this.successBox = data.successBox;
		this.spinImg = data.spinImg;
		this.error = '';
		this.requiredFeilds = data.requiredFeilds;
	}
}