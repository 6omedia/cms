
/*
	
	How to use...

	const industryForm = new Form(forminfo.industry_form);
	const industry = new Taxonomy('industry', industryForm, $('#industry_list'));

*/

console.log('tax file');

class Taxonomy {

	addTax(tax_form, tax_name, tax_list){
		tax_form.sendBtn.on('click', function(){
			tax_form.sendForm(function(){

				console.log('Yeah taxonomy');

				$.ajax({
					url: '/admin/api/add_term',
					type: 'POST',
					// dataType: 'json',
					data:
					{
						taxonomy: tax_name,
						name: tax_form.requiredFeilds[0].value,
						description: tax_form.requiredFeilds[1].value,
						parent: tax_form.requiredFeilds[2].value
					},
					success: function(data)
					{

						console.log(data);

						tax_form.enableSubmit();
						if(data.success == '1'){

							tax_form.successBox.html(tax_name + ' Created').slideDown();

							// console.log(data);
							
							let newCat = `
								<li>
									<input type="checkbox" value="${data.catid}">
									<label>${data.catname}</label>
									<ul class="list">
										<li>
											<span class="delbtn deletecat" data-catid="${data.catid}">Delete</span>
										</li>
										<li>
											<a>Edit</a>
										</li>
									</ul>
								</li>
							`;

							tax_list.prepend(newCat);

						}else{
							if(data.error){
								// const displayError = makeErrorReadable(data.error);
								if(data.error.code == 11000){
									tax_form.errorBox.html('There is already a ' + tax_name + ' with that name').slideDown();	
								}else{
									tax_form.errorBox.html('Something went wrong, please try again later...').slideDown();
								}
								
							}else{
								tax_form.errorBox.html('Something went wrong, please try again later...').slideDown();
							}
						}
					},
					error: function(xhr, desc, err)
					{
						console.log(xhr, desc, err);
					}
				});

			});
		});

	}

	deleteTaxItem(tax_form, tax_name){
		this.tax_list.on('click', '.deletecat', function(){
			const catid = $(this).data('catid');
			const thisli = $(this).parent().parent().parent();

			const popup = new Popup(
				// positive
				function(){

					$.ajax({
						url: '/admin/api/delete',
						type: 'POST',
						// dataType: 'json',
						data:
						{
							delete_item: 'term',
							itemid: catid,
							taxonomy_name: tax_name
						},
						success: function(data)
						{
							console.log(data);
							tax_form.enableSubmit();
							if(data.success == '1'){

								tax_form.successBox.html(data.error).slideDown();
								thisli.remove();
								popup.popDown();

							}else{
								$('.c_modal').remove();
								$('.c_modal').off();
								tax_form.errorBox.html(data.error).slideDown();
							}
						},
						error: function(xhr, desc, err)
						{
							console.log(xhr, desc, err);
						}
					});

				},
				// negitive
				function(){
					popup.popDown();
				}
			);

			popup.popUp('Are you sure you want to delete this ' + tax_name + '?');

		});
	}

	constructor(tax_name, tax_form, tax_list){
		this.tax_name = tax_name;
		this.tax_form = tax_form;
		this.tax_list = tax_list;
		this.addTax(this.tax_form, this.tax_name, this.tax_list);
		this.deleteTaxItem(this.tax_form, this.tax_name);
	}

}