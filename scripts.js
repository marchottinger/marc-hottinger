let Portfolio = (function($) {

    return this;
})(jQuery);

let TextAnimations = (function() {

})();

let Dot = (function($) {
    let $cursor
    ,   cursorXMid
    ,   cursorYMid
    ,   $dot
    ,   dotPosX
    ,   dotPosY
    ,   dotPosOffsetX
    ,   dotPosOffsetY
    ,   inTarget = false
    ,   captured;

    $(window).on("load", _handleLoad);
    $(window).on("resize", _updateLayout);

    $("#dot-target").on("mousemove", _handleMouseMove);
    $("#dot-target").on("mouseenter", _handleMouseEnter);
    $("#dot").on("mouseenter", _handleMouseEnter);
    $("#dot-target").on("mouseleave", _handleMouseLeave);

    function _handleLoad() {
        $cursor = $("#cursor");
        $dot = $("#dot");

        _updateLayout();

        $("#presentation h1 span").css("opacity", "1");

        animateText("#presentation h1 span", {
            name: 'fadeInB',
            duration: 8000,
            delay: 1000
        });

        $("#cursor").css({
            "transform": 'translate(' + dotPosOffsetX + 'px,' + dotPosOffsetY + 'px)',
        });
    }

    function _updateLayout() {
        if($("body").hasClass("home")) {
            cursorXMid = $cursor.width() / 2, 10;
            cursorYMid = $cursor.height() / 2, 10;
            
            dotXMid = $dot.width() / 2, 10;
            dotYMid = $dot.height() / 2, 10;
            dotPosX = $dot.get(0).getBoundingClientRect().left + window.scrollX, 10;
            dotPosY = $dot.get(0).getBoundingClientRect().top + window.scrollY, 10;
            dotPosOffsetX = dotPosX - cursorXMid + dotXMid;
            dotPosOffsetY = dotPosY - cursorYMid + dotYMid;

            $("#cursor").css({
                "transform": 'translate(' + dotPosOffsetX + 'px,' + dotPosOffsetY + 'px)',
            });
        }
    }

    function _handleMouseMove(e) {
        let top = e.pageY - cursorXMid
        ,   left = e.pageX - cursorYMid;

        if (captured) {
            $cursor.css({
                'transform': 'translate(' + left +'px, ' + top +'px)',
                'background-size': '100%'
            });

            // $cursor.on("click", function() {
            //     let href = $(this).attr("href");
            //     location.replace(href);
            // });

            $("#dot-target").on("click", function() {
                let href = $cursor.attr("href");
                location.assign(href);
            });
        }
    }

    function _handleMouseEnter(e) {
        console.log('Enter', e.target);
        
        if ($(e.target).is("#dot")) {
            captured = true;
            $cursor.addClass("hovered");
        }
        
        if ($(e.target).is("#dot-target")) {
            inTarget = true;
        }
    }
    
    function _handleMouseLeave(e) {
        console.log('Leave', e.target);
        $cursor.removeClass("hovered");
        
        if ($(e.target).is("#dot-target")) {
            inTarget = false;
            captured = false;
            
            $cursor.css({
                "transform": 'scale(1) translate(' + dotPosOffsetX + 'px,' + dotPosOffsetY + 'px)',
                'background-size': '50%'
            });
        }
    }
    
    return this;
})(jQuery);