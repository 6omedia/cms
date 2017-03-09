$(document).ready(function(){

	var burger = $('.burger');
    var mobNav = $('#top_nav');

    burger.on('click', function(){
        
        //hasClass
        if(mobNav.hasClass('menu_open')){
        	mobNav.removeClass('menu_open');
        	mobNav.slideUp();
        }else{
        	mobNav.addClass('menu_open');
        	mobNav.slideDown();
        }

    });

});