"use strict";

function kleberAll(query, func) {
    document.querySelectorAll(query).forEach(elem => {
        if(elem.dataset.kleberTarget) {
            return func(document.querySelector(elem.dataset.kleberTarget), elem);
        }

        func(elem, elem);
    });
}

window.addEventListener("load", event => {

    // register click handlers
    kleberAll("[data-kleber-click]", (target, source) => {
        source.addEventListener("click", event => {
            const classes = source.dataset.kleberClick.split(",");
            classes.forEach(className => target.classList.toggle(className));
        });
    });

    // register scroll handlers
    kleberAll("[data-kleber-scroll]", (target, source) => {
        if(!window.__kleberScrollElements) {
            window.__kleberScrollElements = [];
        }

        if(source.dataset.kleberScrollTarget) {
            window.__kleberScrollElements.push([target, source]);
        } else {
            console.warn("Kleber: Scroll defined without scroll target, ignoring.", source);
        }
    });

    function checkScrollEvents() {
        for(let [target, source] of window.__kleberScrollElements) {
            const scrollBarTop = window.pageYOffset;

            let targetElement = document.querySelector(source.dataset.kleberScrollTarget);
            const classes = source.dataset.kleberScroll.split(",");

            const scrollOffset = source.dataset.kleberScrollOffset ?
                Number(source.dataset.kleberScrollOffset) : 0;

            const targetOffset = targetElement.offsetTop;

            if(scrollBarTop >= (targetOffset + scrollOffset)) {
                classes.forEach(className => target.classList.add(className));
            } else {
                classes.forEach(className => target.classList.remove(className));
            }
        }
    }

    window.addEventListener("scroll", checkScrollEvents);
    checkScrollEvents();
})