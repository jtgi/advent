
window.addEventListener('load', () => {

    if (document.getElementsByClassName('ready').length) {
        $('#loader-wrap').fadeOut('fast');
    } else {
        const until = new Date(2020, 11, 1, 0, 0, 0, 0);
        $('#countdown').countdown({ until });
    }

    $('#brew-guide-btn').click(e => {
        e.preventDefault();
        $("#brew-guide").fadeIn(100);
        return false;
    });

    $('#brew-guide-close').click(() => {
        $("#brew-guide").fadeOut(100);
    })

    $([document.documentElement, document.body]).animate({
        scrollTop: $(".target").offset().top
    }, 500);

    function s(src, onComplete) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function () {
            this.sound.play();
        }
        this.stop = function () {
            this.sound.pause();
        }

        this.sound.onended = onComplete;
    }

    const csrf = $("#csrf").text();

    const so = new s('/ven.mp3', () => {
        window.location.href = `/game-genie/${csrf}`;
    });

    const unlock = () => {
        $('#monobutton').addClass('spin');
        $('.number').addClass('spin');
        so.play();
    }

    $('#monobutton').click(createClickHandler(10, 3000, unlock));
    new Konami(unlock);
});

function createClickHandler(n, interval, callback) {
    let clicks = 0;
    let ref;

    const reset = () => {
        ref = setTimeout(() => {
            ref = null;
            clicks = 0;
        }, interval)
    }

    return () => {
        clicks++;

        if (ref) {
            clearTimeout(ref);

            if (clicks === n) {
                callback();
                clicks = 0;
                ref = null;
            } else {
                reset();
            }
        } else {
            reset();
        }
    }
};