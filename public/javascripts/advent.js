
window.addEventListener('load', () => {

    if (document.getElementsByClassName('ready').length) {
        $('#loader-wrap').fadeOut('fast');
    } else {
        const until = new Date(2020, 11, 1, 0, 0, 0, 0);
        $('#countdown').countdown({ until });
    }

    $([document.documentElement, document.body]).animate({
        scrollTop: $(".target").offset().top
    }, 500);
});