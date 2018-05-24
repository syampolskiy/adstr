$(function(){
	// menu dropdowns
	$('.js-toggle-submenu').click(function(e){
		e.preventDefault();

		var self = $(this);
		self.siblings('.js-toggle-me').slideToggle(100, function(){
			self.parent().toggleClass('opened');
		});
	})	
	// menu dropdowns --/
});