$(document).ready(function() {
	var tune = new Audio(),
		$button = $('#play'),
		$icon = $button.find('i'),
		$title = $('.video-title');

	tune.src = 'img/bitcoinvol.mp3';
	tune.autoplay = true;
	tune.loop = true;

	$button.on('click touchstart', function(event) {
		event.preventDefault();
		if (tune.volume == 1) {
			tune.volume = 0;
			$icon.removeClass('fa-volume-up').addClass('fa-volume-off');
		} else {
			tune.volume = 1;
			$icon.removeClass('fa-volume-off').addClass('fa-volume-up');
		}
	});

	setTimeout(function() {
        $title.addClass('close-title').fadeOut('slow');
    }, 5000);
});