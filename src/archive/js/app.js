import $ from 'https://cdn.jsdelivr.net/npm/cash-dom@8.1.5/+esm'
import * as Carousel from './carousel.js'

export let state = {
    currentStatus: "init",
    currentView: "home",
    index: 0,
};

let settings = {
    timeOut: 30000
}

let idleCountdown = function () {
    let time;
    document.onmousemove = resetTimer;
    document.ontouchstart = resetTimer;

    function logout() {
        console.log("resetting app")
        switchView("home");
    }

    function resetTimer() {
        clearTimeout(time);
        time = setTimeout(logout, settings.timeOut);
    }
};

let updateStatus = function(e) {
    state.currentStatus = e.target.readyState;

    if (state.currentStatus === "interactive") {
        loading();
    } else if (state.currentStatus === "complete") {
        init();
    }
};

document.addEventListener('readystatechange', updateStatus, false);

function loading() {
    console.log('loading');
}

function init() {
    Carousel.init();
    enableTabs();
    enableLinks();
    switchView('home');
    idleCountdown();
}

function enableTabs() {
    $(".tab").on("click", function() {
        $(".tab").removeClass("active");
        $(this).addClass("active");
        
        let id = $(this).attr("data-target-id")
        , index = $('[data-gallery-id="' + id + '"][data-gallery-index="0"]').index();

        console.log('id:', id, parseInt(id, 10), (isNaN(parseInt(id, 10))));

        if (!(isNaN(parseInt(id, 10)))) {
            console.log('id, index: ', id, index);
            switchView("gallery");
            Carousel.refresh();
            Carousel.go(index);
        } else {
            switch(id) {
                case "home":
                    switchView("home");
                    setActiveTab("home");
            }
        }
    });
}

function enableLinks() {
    $(".link").on("click", function() {
        let id = $(this).attr("data-target-id")
        , index = $('[data-gallery-id="' + id + '"][data-gallery-index="0"]').index();

        if (!(isNaN(parseInt(id, 10)))) {
            console.log('id, index: ', id, index);
            switchView("gallery");
            Carousel.refresh();
            Carousel.go(index);
        } else {
            switch(id) {
                case "home":
                    switchView("home");
                    setActiveTab("home");
            }
        }
    });
}

export function switchView(view) {
    if (state.currentView != view) {
        state.currentView = view;
        console.log('switch view:', view);
    
        $(".view").removeClass("active");
    
        $("#" + view).addClass("active showing")
            .on("transitionend", function() {
                $(this).removeClass("showing");
            });
    
    }
    setActiveTab(view);

    
};

export function setActiveTab(activeTab) {
    console.log('set tab:', activeTab);

    $(".tab").removeClass("active");
    $('.tab[data-target-id="' + activeTab + '"]').addClass("active");

    if (state.currentView == "gallery") {
        $(".gallery-nav").addClass("display");
    } else {
        $(".gallery-nav").removeClass("display");
    }
}