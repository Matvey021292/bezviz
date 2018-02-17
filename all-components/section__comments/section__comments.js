  $('.comments_slider').slick({
  	slidesToShow: 3,
  	slidesToScroll: 1,
  	autoplay: true,
  	autoplaySpeed: 2000,
  	dots: true,
  	infinite: true,
    nextArrow: $('.nextArow'),
    prevArrow: $('.prevArrow'),
  	responsive: [
  	{
  		breakpoint: 1024,
  		settings: {
  			slidesToShow: 2,
  			slidesToScroll: 1
  		}
  	},
  	{
  		breakpoint: 800,
  		settings: {
  			slidesToShow: 1,
  			slidesToScroll: 1
  		}
  	}
    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
    ]
});
