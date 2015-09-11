$(document).on('click', '.games-list-title', function() {
	$('.games-list').toggleClass('show-list');
	$( "<div class='overlay'></div>" ).appendTo( "body" );
});

$(document).on('click', '.overlay, .link-container a', function() {
	$('.games-list').toggleClass('show-list');
	$('.overlay').remove();
});

$(document).on('click', '.submit-predictions', function() {
	$(this).addClass('submitted');
	$(this).text("Submitted");
})