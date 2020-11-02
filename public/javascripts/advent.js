
window.addEventListener('load', () => {
    if (document.getElementsByClassName('ready').length) {
        $('#loader-wrap').fadeOut('fast');
    }

    $([document.documentElement, document.body]).animate({
        scrollTop: $(".target").offset().top
    }, 500);
});