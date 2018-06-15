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

	// tabs
	$("#tabs").tabs();
	$('#date_range, #date_range_time').hide();
	// $('#date_range').enable();

	$('#startDay,#endDay').click(function() {
		$('#date_range').toggle('slow');
	});
	$('#startDayTime,#endDayTime').click(function() {
		$('#date_range_time').toggle('slow');
	});

	// chart dropdown

	$(".dropdown dt a").on('click', function() {
		$(".dropdown dd ul").slideToggle('fast');
	});

	$(".dropdown dd ul li a").on('click', function() {
		$(".dropdown dd ul").hide();
	});

	$(document).bind('click', function(e) {
		var $clicked = $(e.target);
		if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
	});


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