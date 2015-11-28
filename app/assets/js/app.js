$(document).on('click', '.submit-predictions', function() {
    $(this).addClass('submitted');
    $(this).text("Submitted");
});

$('.menu-link').click(function() {
    $('.overlay').remove();
    $('body').toggleClass('menu-open');
    $("<div class='overlay'></div>").appendTo("body");
});

$(document).on('click', '.overlay', function() {
    $('body').toggleClass('menu-open');
    $('.overlay').remove();
});

$('.nav-sub-link').click(function() {
    $(this).next('ul').toggleClass('open');

});
