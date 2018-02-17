$(document).ready(function(){
    $('#nav-icon3').click(function(){
        $(this).toggleClass('open');
        $(".header-navigation").toggleClass('header-navigation--active');
    });
});