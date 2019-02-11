"use strict";

function kleberAll(query, func) {
    document.querySelectorAll(query).forEach(elem => {
        if(elem.dataset.kleberTarget) {
            return func(document.querySelectorAll(elem.dataset.kleberTarget), elem);
        }

        func([elem], elem);
    });
}

window.addEventListener("load", event => {

    // register click handlers
    kleberAll("[data-kleber-click]", (targets, source) => {
        source.addEventListener("click", event => {
            const classes = source.dataset.kleberClick.split(",");
            classes.forEach(className => targets.forEach(target => target.classList.toggle(className)));
        });
    });

    // register scroll handlers
    kleberAll("[data-kleber-scroll]", (targets, source) => {
        if(!window.__kleberScrollElements) {
            window.__kleberScrollElements = [];
        }

        if(source.dataset.kleberScrollTarget) {
            window.__kleberScrollElements.push([targets, source]);
        } else {
            console.warn("Kleber: Scroll defined without scroll target, ignoring.", source);
        }
    });

    // register enters viewport handlers
    kleberAll("[data-kleber-enters-viewport]", (targets, source) => {
        if(!window.__kleberScrollEntersViewportElements) {
            window.__kleberScrollEntersViewportElements = [];
        }

        window.__kleberScrollEntersViewportElements.push([targets, source]);
    });

    function checkScrollEvents() {
        if(window.__kleberScrollElements) {
            for(let [targets, source] of window.__kleberScrollElements) {
                const scrollBarTop = window.pageYOffset;

                let targetElement = document.querySelector(source.dataset.kleberScrollTarget);

                if(!targetElement) {
                    // if the target element doesn't exist, stop here
                    continue;
                }

                const classes = source.dataset.kleberScroll.split(",");

                const scrollOffset = source.dataset.kleberScrollOffset ?
                    Number(source.dataset.kleberScrollOffset) : 0;

                const targetOffset = targetElement.offsetTop;

                if(scrollBarTop >= (targetOffset + scrollOffset)) {
                    classes.forEach(className => targets.forEach(target => target.classList.add(className)));
                } else {
                    if(source.dataset.kleberStay !== "true") {
                        classes.forEach(className => targets.forEach(target => target.classList.remove(className)));
                    }
                }
            }
        }

        if(window.__kleberScrollEntersViewportElements) {
            const rectIntersect = (r1, r2) => !(
                r2.left > r1.right ||
                r2.right < r1.left ||
                r2.top > r1.bottom ||
                r2.bottom < r1.top
            );

            for(let [targets, source] of window.__kleberScrollEntersViewportElements) {
                const screenRect = {top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight};
                const elementRect = source.getBoundingClientRect();

                const classes = source.dataset.kleberEntersViewport.split(",");

                if(rectIntersect(screenRect, elementRect)) {
                    classes.forEach(className => targets.forEach(target => target.classList.add(className)));
                } else {
                    if(source.dataset.kleberStay !== "true") {
                        classes.forEach(className => targets.forEach(target => target.classList.remove(className)));
                    }
                }
            }
        }
    }

    window.addEventListener("scroll", checkScrollEvents);
    checkScrollEvents();
})
