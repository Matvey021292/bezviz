$(window).scroll(function() {

    console.log($('#bgvideo').offset().top);
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $('.head-content').offset().top;
    var elemBottom = elemTop + $('.head-content').height();
    console.log(((elemBottom <= docViewBottom) && (elemTop >= docViewTop)));

    if ((elemBottom <= docViewBottom) && ($(window).scrollTop() > $(window).height())) {
        
        $('#bgvideo').addClass('video-fixed');

    } else {

        $('#bgvideo').removeClass('video-fixed');
    }

});