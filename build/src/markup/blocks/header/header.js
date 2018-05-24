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
    function hideWhenClickOutside(e, blocks){
        blocks.forEach(function(block){
            if (!block.is(e.target) && block.has(e.target).length === 0) {
                block.removeClass('opened');
            }
        });
    }
    // dropdowns --/
});