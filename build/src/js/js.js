$(function() {
    // init scrollable content
    initScrollable();

    function initScrollable() {
        $(".js-init-scrollable").each(function(){
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




});