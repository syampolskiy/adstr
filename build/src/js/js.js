$(function() {
    // scrollable content
    scrollable();
    $(window).on('load resize', scrollable);

    function scrollable(){
        if ($(window).width() > 767){
            initScrollable();
        } else{
            destroyScrollable();
        }
    }
    function initScrollable() {
        $(".js-init-scrollable").each(function() {
            var axis = $(this).attr('data-axis');
            var position = $(this).attr('data-position');
            $(this).mCustomScrollbar({
                scrollInertia: 100,
                axis: axis ? axis : "y",
                scrollbarPosition: position ? position : "inside"
            });

        });
    }
    function destroyScrollable() {
        $(".js-init-scrollable").each(function() {
            $(this).mCustomScrollbar("destroy");
        });
    }
    // scrollable content --/

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

        $('#startDay,#endDay').click(function(){
        $('#date_range').toggle('slow');
        });
        $('#startDayTime,#endDayTime,#startDayTimeAd,#endDayTimeAd').click(function(){
        $('#date_range_time,#date_range_timeAd').toggle('slow');
        });
        $('#startDayFollowers,#endDayFollowers').click(function(){
        $('#date_range_followers').toggle('slow');
        });

        // chart dropdown

    $(".dropdown dt a").on('click', function () {
        $(".dropdown dd ul").slideToggle('fast');
    });

    $(".dropdown dd ul li a").on('click', function () {
        $(".dropdown dd ul").hide();
    });

    $(document).bind('click', function (e) {
        var $clicked = $(e.target);
        if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
    });

    // padding for content with notify bar
    setPaddingForContentWithNotifyBar();
    $(window).on('load resize', function(){
        setPaddingForContentWithNotifyBar();
    });
    function setPaddingForContentWithNotifyBar(){
        var pt = $(window).width() > 767 ? $('.notify-bar').outerHeight() : $('.notify-bar').outerHeight()  + 29;
        $(".js-set-padd-top .scrollable").css('padding-top', pt + "px");
    }
    // padding for content with notify bar --/
});