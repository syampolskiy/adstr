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
	$('.js-init-responsive-table').rtResponsiveTables();
	// init responsive table --/

	// tabs
	$("#tabs").tabs();
	$('#date_range, #date_range_time,#date_range_followers ,#date_range_timeAd').hide();
	// $('#date_range').enable();

	$('#startDay,#endDay').click(function() {
		$('#date_range').toggle('slow');
	});
	$('#startDayTime,#endDayTime,#startDayTimeAd,#endDayTimeAd').click(function() {
		$('#date_range_time,#date_range_timeAd').toggle('slow');
	});
	$('#startDayFollowers,#endDayFollowers').click(function() {
		$('#date_range_followers').toggle('slow');
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
(function(a) {
	a.fn.rtResponsiveTables = function(b) {
		var d = a.extend({
			containerBreakPoint: 0
		}, b);
		rtStartingOuterWidth = a(window).width();
		is_iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
		rt_responsive_table_object = this;

		function f(g) {
			return !a.trim(g.html())
		}

		function e(g) {
			rt_css_code = '<style type="text/css">';
			a(g).find("th").each(function(h, i) {
				rt_css_code += g + ".rt-vertical-table td:nth-of-type(" + (h + 1) + '):before { content: "' + a(this).text().trim() + '"; }'
			});
			rt_css_code += "</style>";
			a(rt_css_code).appendTo("head")
		}

		function c(g) {
			rt_table_width = 0;
			if (g.hasClass("rt-vertical-table")) {
				rt_table_width = g.outerWidth()
			} else {
				g.find("th").each(function(h, i) {
					rt_table_width += a(this).outerWidth()
				});
				rt_table_width = rt_table_width
			}
			return rt_table_width
		}
		window.fix_responsive_tables = function() {
			if (a("table.rt-responsive-table").length) {
				a("table.rt-responsive-table").each(function(g) {
					rt_containers_width = a(this).parent().width();
					rt_current_width = c(a(this)) - 1;
					rt_max_width = a(this).attr("data-rt-max-width");
					rt_has_class_rt_vertical_table = a(this).hasClass("rt-vertical-table");
					if (a(this).attr("data-rtContainerBreakPoint")) {
						rt_user_defined_container_breakpoint = a(this).attr("data-rtContainerBreakPoint")
					} else {
						rt_user_defined_container_breakpoint = d.containerBreakPoint
					}
					if (rt_containers_width < rt_current_width || rt_containers_width <= rt_user_defined_container_breakpoint) {
						a(this).addClass("rt-vertical-table");
						if (rt_max_width > rt_current_width && rt_max_width > rt_user_defined_container_breakpoint) {
							a(this).attr("data-rt-max-width", rt_current_width)
						} else {
							if (rt_max_width > rt_current_width && rt_max_width <= rt_user_defined_container_breakpoint) {
								a(this).attr("data-rt-max-width", rt_user_defined_container_breakpoint)
							}
						}
					} else {
						if (rt_containers_width > rt_max_width && rt_containers_width > rt_user_defined_container_breakpoint) {
							a(this).removeClass("rt-vertical-table");
							if ((rt_max_width > rt_current_width && !rt_has_class_rt_vertical_table) && (rt_max_width > rt_user_defined_container_breakpoint && !rt_has_class_rt_vertical_table)) {
								a(this).attr("data-rt-max-width", rt_current_width)
							} else {
								if ((rt_max_width > rt_current_width && !rt_has_class_rt_vertical_table) && (rt_max_width <= rt_user_defined_container_breakpoint && !rt_has_class_rt_vertical_table)) {
									a(this).attr("data-rt-max-width", rt_user_defined_container_breakpoint)
								}
							}
						} else {}
					}
				})
			}
		};
		rt_responsive_table_object.each(function(g, h) {
			a(this).addClass("rt-responsive-table-" + g).addClass("rt-responsive-table");
			if (g == rt_responsive_table_object.length - 1) {
				a(window).resize(function() {
					if (!is_iOS || (is_iOS && (rtStartingOuterWidth !== a(window).width()))) {
						rtStartingOuterWidth = a(window).width();
						fix_responsive_tables()
					}
				});
				rt_responsive_table_count = a("table.rt-responsive-table").length;
				a("table.rt-responsive-table").each(function(j, i) {
					e("table.rt-responsive-table-" + j);
					a("table.rt-responsive-table-" + j).attr("data-rt-max-width", c(a(this)));
					a(this).find("td,th").each(function(l, k) {
						if (f(a(this))) {
							a(this).html("&#160;")
						}
					});
					if (rt_responsive_table_count - 1 == j) {
						fix_responsive_tables()
					}
				})
			}
		});
		return this
	}
}(jQuery));
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