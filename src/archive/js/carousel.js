import $ from 'https://cdn.jsdelivr.net/npm/cash-dom@8.1.5/+esm'
import Swiper, {Navigation} from 'https://cdn.jsdelivr.net/npm/swiper@9.2.4/+esm';
import data from './data.json' assert {type: 'json'};

// In case Firefox is required…
// import { createRequire } from 'node:module';
// const require = createRequire(import.meta.url);

// const data = require('./data.json');

import * as App from './app.js';

let index = 0
,   swiper;

export function init() {
    buildGallery();

    $(function () {
        refresh();
        go(index);
        App.state.currentStatus = "ready";
    });
};

function buildGallery() {
    console.log('building gallery');
    data.galleries.forEach((gallery, i) => {
        gallery.images.forEach((image, i) => {
            let uri = encodeURI(`./${data.basepath}${gallery.basepath}${image.basepath}${image.filename}`)
            ,   titleSeparator = (image.title) ? ',' : '';

            $(`<div data-gallery-id="${gallery.year}" data-gallery-index="${i}" class="swiper-slide"><img src="${uri}"></div>`).appendTo('.swiper-wrapper');

            $(`<article class="caption flow">
                    <h2 class="h4">${image.author}</h2>
                    <h3 class="h5 muted">
                        ${image.title}<br>
                        ${gallery.year}, ${image.prix}
                        </h3>
                    <p>${image.description}</p>
                </article>`).appendTo('.captions');
        });
    });
    
    swiper = new Swiper('.swiper', {
        modules: [Navigation],
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        loop: true,
        loopedSlides: 0,
        spaceBetween: 48,
    });
    
    swiper.on('slideChangeTransitionStart', function () {
        refresh();
    });
}

function updateCaption() {
    console.log('update caption:', index);

    $(".caption").removeClass("active updating");
    $(".caption").eq(index).addClass("active updating");

    swiper.on('slideChangeTransitionEnd', function () {
        $(".caption").eq(index).removeClass("updating");
    });
}

function updateActiveTab() {
    let activeTab = $(".swiper-slide-active").attr("data-gallery-id");
    console.log('update tab:', activeTab);

    $(".tab").removeClass("active");
    $('.tab[data-target-id="' + activeTab + '"]').addClass("active");
}

/**
 * Displays a slide at the specified index.
 * @param {number} slideIndex The target slide's index.
 */
export function go(slideIndex) {
    console.log('go:', index);
    index = slideIndex;
    swiper.slideTo(index);
}

export function refresh() {
    index = swiper.realIndex;
    App.state.index = index;
    console.log('refresh:', index, App.state.currentView);

    updateCaption();
    if (App.state.currentView == "gallery") {
        updateActiveTab();
    }
}