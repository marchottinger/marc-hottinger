// utils.js
export function getDecryptedMailto (s) {
    let n = 0
    ,   r = "";
    
    for (var i = 0; i < s.length; i++) {
        n = s.charCodeAt( i );

        if( n >= 8364 ) {
            n = 128;
        }

        r += String.fromCharCode( n - 1 );
    }

    return r;
}

export function decryptMail(s) {
    location.href = Utils.getDecryptedMailto(s) + "?subject=Prise de contact";
}


// animations.js
function _load() {
    if ($(".home").length) {
        Portfolio.Animations.displayText("#presentation h1 span");
        Portfolio.Animations.parallax($('#portrait').get(0));
        Portfolio.Animations.targetFocusedInputs();
    }
}

export function displayText(text) {
    $(text).css({opacity: 1});

    animateText(text, {
        name: 'fadeInB',
        duration: 8000,
        delay: 1000
    });
}

export function parallax(image) {
    new simpleParallax($(image).get(0), {
        overflow: true,
        delay: .8,
        scale: 1.1,
        maxTransition: 80
    });
}

export function targetFocusedInputs() {
    $('input[type="text"]').on("focus", function() {
        $(this).parent().toggleClass("focus");
    }).on("blur", function() {
        $(this).parent().removeClass("focus");
    });
}

export function initialize() {
    console.log("Animations: init");
    $(window).on("load", _load);
}

// interactions.js
export function makeElementsAppear($els, options) {
    $els.addClass("animate-apparition");

    var appearingElements = Portfolio.Interaction.displayWhenInViewport($els, options);
    $(document).on('DOMContentLoaded load resize scroll shown.bs.tab', appearingElements);
}

/**
 * Triggers various actions when a DOM element or jQuery object becomes visible in the viewport.
 * @author Marc Hottinger
 * @param   {object} els     A list of DOM elements or jQuery objects to be checked against.
 * @param   {object} options Optional object literal to specify settings.
 * @returns {function} A function to process visibility state of a list of DOM elements or jQuery objects to be checked against.
 */
export function displayWhenInViewport(els, options) {
    return function () {
        $(els).each(function () {
            var $el       = $(this),
                willShow  = $el.hasClass("visible"),
                isVisible = Portfolio.Utils.Dom.isInViewport($el, options);

            if (!willShow && isVisible) {
                Portfolio.Utils.waitLoad($el, function () {
                    Portfolio.Interaction.display($el, options);
                });
            }
        });
    };
}

/**
 * Adjusts css classes to make the specified jQuery object(s) visible.
 * @author Marc Hottinger
 * @param {object} $els A set of jQuery elements.
 */
export function display($els, options) {
    let defaults = {
        delay: 0
    },
        settings = $.extend({}, defaults, options);

    let timeoutDelay = window.setTimeout(function() {
        $els.addClass("visible").hover(function () {
            $els.addClass("hovered");
        });

        window.clearTimeout(timeoutDelay);
        return $els;
    }, settings.delay);
}









// cursor.js
let $cursor
,   cursorXMid
,   cursorYMid
,   $dot
,   dotPosX
,   dotPosY
,   dotPosOffsetX
,   dotPosOffsetY
,   inTarget = false
,   captured = false;

function _load() {
    $cursor = $("#cursor");
    $dot = $("#dot");
    cursorXMid = $cursor.width() / 2;
    cursorYMid = $cursor.height() / 2;
    dotXMid = $dot.width() / 2;
    dotYMid = $dot.height() / 2;

    $(window).on("load", () => {
        _update();
    });
}

function _update() { 
    $cursor.addClass("init");       
    dotPosX = $dot.get(0).getBoundingClientRect().left + window.scrollX;
    dotPosY = $dot.get(0).getBoundingClientRect().top + window.scrollY;
    dotPosOffsetX = dotPosX - cursorXMid + dotXMid;
    dotPosOffsetY = dotPosY - cursorYMid + dotYMid;

    $cursor.css({
        "transform": 'translate(' + dotPosOffsetX + 'px,' + dotPosOffsetY + 'px)'
    });
}

function _mouseMove(e) {
    let top = e.pageY - cursorXMid
    ,   left = e.pageX - cursorYMid;

    $("#dot-target").on("click", function() {
        if (captured) {
            let href = $cursor.attr("href");
            location.assign(href);
        }
    });

    if (captured) {
        $cursor.css({
            'transform': 'translate(' + left + 'px, ' + top + 'px)',
            'background-size': '100%'
        });

    }
}

function _mouseEnter(e) {
    console.log('Enter', e.target);
    
    if ($(e.target).is("#dot")) {
        captured = true;

        $cursor.add("#dot-target").addClass("hovered");
    }
    
    if ($(e.target).is("#dot-target")) {
        inTarget = true;
    }
}

function _mouseLeave(e) {
    console.log('Leave', e.target);

    inTarget = false;
    captured = false;

    $cursor.add("#dot-target").removeClass("hovered");
    
    if ($(e.target).is("#dot-target")) {
        $cursor.css({
            "transform": 'scale(1) translate(' + dotPosOffsetX + 'px,' + dotPosOffsetY + 'px)',
            'background-size': '50%'
        });
    }
}

export function initialize() {
    console.log("Interaction.Cursor: init");

    $(window).on("load", _load);
    $(window).on("resize", _update);
    $(window).on("scroll", _update);
    $("#dot").on("mouseenter", _mouseEnter);
    $("#dot-target").on("mousemove", _mouseMove);
    $("#dot-target").on("mouseenter", _mouseEnter);
    $("#dot-target").on("mouseleave", _mouseLeave);
}

// utils.js
/**
 * [[Description]]
 * @author Marc Hottinger
 * @param   {[[Type]]} $els     [[Description]]
 * @param   {[[Type]]} callback [[Description]]
 * @returns {[[Type]]} [[Description]]
 */
export function waitLoad($els, callback) {
    $els.each(function () {
        $el = $(this);

        if ($el.is("img")) {
            console.log("Waiting until image loads");

            $el.one("load", function () {
                console.log("Image loaded");

                typeof callback === 'function' && callback();
            }).each(function () {
                if (this.complete) {
                    $(this).trigger('load');
                }
            });
        } else {
            console.log("No image. Skipping Lazy loading.")
            typeof callback === 'function' && callback();
        }
    });

    return $el;
}

/**
 * Checks wether a DOM element or jQuery object is visible in the viewport.
 * @author Marc Hottinger
 * @param   {object} el                  A single DOM element or jQuery object to be checked against.
 * @param   {object} options Optional object literal to specify settings.
 * @returns {boolean} Returns true if element is in viewport, false if it is outside viewport. Top, bottom, left and right offsets can be used to specify a minimum visible portion of the element.
 */
export function isInViewport(el, options) {
    //TODO add support for percent values.
    let defaults = {
        topOffset: 0,
        bottomOffset: 0,
        leftOffset: 0,
        rightOffset: 0
    },
        settings = $.extend({}, defaults, options);

    let rect = el[0].getBoundingClientRect()
    ,   bOffset = settings.bottomOffset
    ,   rOffset = settings.rightOffset
    ,   tOffset = settings.topOffset
    ,   lOffset = settings.leftOffset;

    return (
        rect.bottom >= 0 + bOffset &&
        rect.right >= 0 + rOffset &&
        rect.top <= (window.innerHeight - tOffset || document.documentElement.clientHeight - tOffset) &&
        rect.left <= (window.innerWidth + lOffset || document.documentElement.clientWidth + lOffset));

    // SOURCE https://stackoverflow.com/questions/123999/how-can-i-tell-if-a-dom-element-is-visible-in-the-current-viewport
}





//main.js
import * as Utils 

(function($) {
    $(function () {
        $("body").removeClass("no-js").addClass("js");

        Portfolio.Interaction.makeElementsAppear($(".animate-apparition"), {
            topOffset: 200,
            bottomOffset: 200
        });
    
        $(".animate-apparition-recursive .animate-apparition").each(function(i) {
            $(this).find("> *").each(function(i) {
                Portfolio.Interaction.makeElementsAppear($(this), {
                    topOffset: 200,
                    bottomOffset: 200,
                    delay: i * 20
                });
            });
        });
    });

    if ($(".home").length) {
        Portfolio.Interaction.Cursor.initialize();
    }

    Animations.initialize();
})(jQuery);