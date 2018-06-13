$(function() {
	// init scrollable content
	initScrollable();

	function initScrollable() {
		$(".js-init-scrollable").each(function() {
			var axis = $(this).attr('data-axis');
			var position = $(this).attr('data-position');
			$(this).mCustomScrollbar({
				scrollInertia: 50,
				axis: axis ? axis : "y",
				scrollbarPosition: position ? position : "inside"
			});

		});
	}
	// init scrollable content --/

	// init selectric
	$('.js-init-selectric').selectric({
		optionsItemBuilder: function(itemData, element, index) {
			var content = $(itemData.element).data('content');
			return content;
		}
	});
	// init selectric --/

	// init responsive table
	// $('.js-init-responsive-table')
	// init responsive table --/
<<<<<<< HEAD

	// tabs
	$("#tabs").tabs();




=======
>>>>>>> 130d6e861ff0b186f15841179281008d77929001
});
$(function() {
	// dropdowns
	$('.js-toggle-dropdown').click(function() {
		$(this).toggleClass('opened');
	});
	$('.js-toggle-notifications').hover(function() {
		$(this).toggleClass('opened');
	});

	$(document).on('mouseup touchend', function(e) {
		// var blocks = [$(".js-toggle-dropdown"), $(".js-toggle-notifications")];
		var blocks = [$(".js-toggle-dropdown")];

		hideWhenClickOutside(e, blocks);
	});

	function hideWhenClickOutside(e, blocks) {
		blocks.forEach(function(block) {
			if (!block.is(e.target) && block.has(e.target).length === 0) {
				block.removeClass('opened');
			}
		});
	}
	// dropdowns --/
});
$(function() {
	// menu dropdowns
	$('.js-toggle-submenu').click(function(e) {
		e.preventDefault();

		var self = $(this);
		self.siblings('.js-toggle-me').slideToggle(100, function() {
			self.parent().toggleClass('opened');
		});
	})
	// menu dropdowns --/
});