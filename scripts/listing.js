/**
 * Portfolio listing methods and utilities. 
 * @namespace
 * @version 0.1
 * @author Marc Hottinger
 **/
 Listing = (function ($) {
    let $body   = $("body")
    ,   $projectInfos = $(".project-infos")
    ,   $projects = $(".portfolio").find(".medias li")
    ,   $currentProject
    ,   currentIndex
    ,   vh;

    // Little debounce test.
    // Useful to initalize some actions based on scroll position.
    const debounce = (callback, wait) => {
        let timeoutId = null;
        return (...args) => {
            window.clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => {
                callback.apply(null, args);
            }, wait);
        };
    }
    
    const handleMouseMove = debounce((ev) => {
        console.log('scroll');
    }, 250);
    
    window.addEventListener('scroll', handleMouseMove);

    // End debounce test

    /**
     * Updates the current project's infos.
     * @author Marc Hottinger
     */
    function _updateInfos() {
        $body.attr("data-current-project", currentIndex);
        // Begin the transition to hide and update the project's infos.
        $projectInfos.addClass("update-infos");

        // Timeout to change the project's infos during the the middle of the transition.
        // var to = setTimeout(() => {
            let projectTagline = $currentProject.attr("data-tagline")
            ,   projectTitle = $currentProject.attr("data-title");
            console.group("Project Infos: ", currentIndex);
            if ($currentProject.length) {
                console.log("projectTitle: ", projectTitle);
                console.log("projectTagline: ", projectTagline);
            } else {
                console.warn("No project matching index")
            }
            console.groupEnd();    

            $(".portfolio .project.tagline").text(projectTagline);
            $(".portfolio .project.title").text(projectTitle);

            // Begin the transition to show the updated project's infos.
            $projectInfos.removeClass("update-infos");
        // }, 200);
    }

     /**
     * Updates layout vars.
     * @author Marc Hottinger
     */
    function _updateSpecs() {
        projectsHeight = $projects.outerHeight(true);
        vh = $(window).height();
    }

    /**
     * Enables the parallax feature.
     * @author Marc Hottinger
     */
     function _enableParallax() {
        new simpleParallax(
            document.getElementsByClassName('parallax')
            , {
                delay: .35,
                scale: 1.2,
                transition: 'cubic-bezier(0, 0, 0.25, 1)'
        });
    };

    /**
     * Enables various pointer-based interactions.
     * @author Marc Hottinger
     */
    function _enableInteraction() {
        $currentProject
        .on("mouseenter", function() {
            $projectInfos.find("a").addClass("hover");
        })
        .on("mouseleave", function() {
            $projectInfos.find("a").removeClass("hover");
        })
        .addClass("focus").siblings().removeClass("focus");
    }

    /**
     * Displays the titles of the projects according to the position of the thumbnails in the list.
     * @author Marc Hottinger
     */
     this.displayInfos = () => {
        _updateSpecs();

        $(window).on("resize", function () {
            _updateSpecs();
        });

        $(window).on("scroll", function () {
            let st = $(document).scrollTop(), projectsOffset = $projects.first().position().top, projectsHeight = $projects.outerHeight(true), index = Math.max(0, Math.floor((st + vh / 2 - projectsOffset + projectsHeight / 2 - vh / 3) / projectsHeight));

            // let $testProject = $projects.eq(1);
            // try {
            //     Eanim.Interaction.makeElementsAppear($testProject);
            // } catch(e) {
            //     if (e instanceof TypeError) {
            //         console.error(`${e.name}: ${e.message}, ${e.lineNumber}`);
            //     }
            // }
            
            if (currentIndex != index) {
                currentIndex = index;

                $currentProject = $projects.eq(currentIndex);

                _updateInfos();
                _enableInteraction();
            }
        });
    }

    /**
     * Initializes the interactive features of the project listing.
     * @author Marc Hottinger
     */
    this.init = function () {
        console.log('Listing initListing() - Initialized');
        Eanim.Utils.stickyObs($(".sticky"));
        
        if ($(".portfolio").length) {
            displayInfos();
        }

        _enableParallax();
    }

    return this;
})(jQuery);