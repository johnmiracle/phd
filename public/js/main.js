jQuery(document).ready(function ($) {
    var galleryItems = $('.cd-gallery').children('li');

    galleryItems.each(function () {
        var container = $(this);

        // preview image hover effect - desktop only
        container.on('mouseover', '.move-right, .move-left', function (event) {
            hoverItem($(this), true);
        });
        container.on('mouseleave', '.move-right, .move-left', function (event) {
            hoverItem($(this), false);
        });

        // update slider when user clicks on the preview images
        container.on('click', '.move-right, .move-left', function (event) {
            event.preventDefault();
            if ($(this).hasClass('move-right')) {
                var selectedPosition = container.find('.cd-item-wrapper .selected').index() + 1;
                nextSlide(container);
            } else {
                var selectedPosition = container.find('.cd-item-wrapper .selected').index() - 1;
                prevSlide(container);
            }
        });
    });


    function hoverItem(item, bool) {
        (item.hasClass('move-right'))
            ? item.toggleClass('hover', bool).siblings('.selected, .move-left').toggleClass('focus-on-right', bool)
            : item.toggleClass('hover', bool).siblings('.selected, .move-right').toggleClass('focus-on-left', bool);
    }

    function nextSlide(container, dots, n) {
        var visibleSlide = container.find('.cd-item-wrapper .selected');
        if (typeof n === 'undefined') n = visibleSlide.index() + 1;
        visibleSlide.removeClass('selected');
        container.find('.cd-item-wrapper li').eq(n).addClass('selected').removeClass('move-right hover').prevAll().removeClass('move-right move-left focus-on-right').addClass('hide-left').end().prev().removeClass('hide-left').addClass('move-left').end().next().addClass('move-right');
    }

    function prevSlide(container, dots, n) {
        var visibleSlide = container.find('.cd-item-wrapper .selected');
        if (typeof n === 'undefined') n = visibleSlide.index() - 1;
        visibleSlide.removeClass('selected focus-on-left');
        container.find('.cd-item-wrapper li').eq(n).addClass('selected').removeClass('move-left hide-left hover').nextAll().removeClass('hide-left move-right move-left focus-on-left').end().next().addClass('move-right').end().prev().removeClass('hide-left').addClass('move-left');
    }

});
