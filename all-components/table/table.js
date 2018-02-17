
var navigate,
    cell,
    mainTable;
    
var autoWidthCell = function () {
    
    var main_width = mainTable.width() - navigate.width();
    var cell_width = Math.floor(main_width / cell);
    
    cell_width > 1 ? cell_width = cell_width - 1 : cell_width = 1;
    mainTable.find('thead th:not(:first)').css({
        'max-width': main_width / cell_width,
        'min-width': main_width / cell_width
    });
};

$(document).ready(function () {
    
    navigate = $('#navigate-table');
    mainTable = $('#accounts-table');
    cell = mainTable.find('thead th').eq(1).width();
    
    autoWidthCell();
    
    var touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';
    
    $(".slide-right").on(touchEvent, function () {
        var scrollLeft = mainTable[0].scrollLeft;
        if (scrollLeft < mainTable[0].scrollWidth - mainTable.width()) {
            scrollLeft += mainTable.find('thead th').eq(1).outerWidth();
        }
        mainTable.animate({scrollLeft: scrollLeft}, 200);
    });
    $(".slide-left").on(touchEvent, function () {
        var scrollLeft = mainTable[0].scrollLeft;
        scrollLeft -= mainTable.find('thead th').eq(1).outerWidth();
        if (scrollLeft < 0) {
            scrollLeft = 0;
        }
        mainTable.animate({scrollLeft: scrollLeft}, 200);
    });
});

$(window).resize(function () {
    autoWidthCell();
});

