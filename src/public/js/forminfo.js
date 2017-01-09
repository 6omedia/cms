const forminfo = {
	business_form: {
		sendBtn: $('#send_btn'),
		updateBtn: $('#update_btn'),
		deleteBtn: $('#delete_btn'),
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
				feildName: 'website',
				elem: $('#q_website'),
				value: '',
				required: false
			},
			{
				feildName: 'phone',
				elem: $('#q_phone'),
				value: '',
				error: 'Phone number required',
				required: true
			},
			{
				feildName: 'email',
				elem: $('#q_email'),
				value: '',
				error: 'Email required',
				required: true
			},
			{
				feildName: 'first line of address',
				elem: $('#q_addresslineone'),
				value: '',
				error: 'Fist line of address required',
				required: true
			},
			{
				feildName: 'town',
				elem: $('#q_town'),
				value: '',
				error: 'Town or city required',
				required: true
			},
			{
				feildName: 'post code',
				elem: $('#q_postcode'),
				value: '',
				error: 'Phone number required',
				required: true
			},
			{
				feildName: 'industry',
				elem: $('#q_industry'),
				value: '',
				error: 'Industry required',
				required: true
			},
			{
				feildName: 'opening hours',
				elem: $('#q_openinghours'),
				value: '',
				error: 'Opening hours required',
				required: true
			},
			{
				feildName: 'service one',
				elem: $('#q_service1'),
				value: '',
				error: 'Please select at least one service',
				required: true
			},
			{
				feildName: 'service two',
				elem: $('#q_service2'),
				value: '',
				required: false
			},
			{
				feildName: 'service three',
				elem: $('#q_service3'),
				value: '',
				required: false
			},
			{
				feildName: 'facebook',
				elem: $('#q_fb'),
				value: '',
				required: false
			},
			{
				feildName: 'twitter',
				elem: $('#q_tw'),
				value: '',
				required: false
			},
			{
				feildName: 'instagram',
				elem: $('#q_in'),
				value: '',
				required: false
			},
			{
				feildName: 'youtube',
				elem: $('#q_yt'),
				value: '',
				required: false
			},
			{
				feildName: 'linked in',
				elem: $('#q_li'),
				value: '',
				required: false
			}
		]
	},
	posts_form: {
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
			}
		]
	}
}


