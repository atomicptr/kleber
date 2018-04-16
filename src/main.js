"use strict";

function kleberAll(query, func) {
    document.querySelectorAll(query).forEach(func);
}

window.addEventListener("load", event => {

    // register click handler
    kleberAll("[data-kleber-click]", elem => {
        elem.addEventListener("click", event => {
            let target = elem;

            if(elem.dataset.kleberTarget) {
                target = document.querySelector(elem.dataset.kleberTarget);
            }

            const classes = elem.dataset.kleberClick.split(",");
            classes.forEach(className => target.classList.toggle(className));
        });
    });

    kleberAll("[data-kleber-scroll]", elem => {
        if(elem.dataset.kleberScrollThreshold) {
            const checkScroll = event => {
                if(!event) event = {}

                let target = event.target ? event.target.scrollingElement : {scrollTop: window.pageYOffset};

                if(elem.dataset.kleberTarget) {
                    target = document.querySelector(elem.dataset.kleberTarget);
                }

                const scrollTop = target.scrollTop;
                const threshold = Number(elem.dataset.kleberScrollThreshold);
                const classes = elem.dataset.kleberScroll.split(",");

                if(scrollTop >= threshold) {
                    classes.forEach(className => elem.classList.add(className));
                } else {
                    classes.forEach(className => elem.classList.remove(className));
                }
            };

            window.addEventListener("scroll", checkScroll);

            checkScroll();
        } else {
            console.warn("Kleber: Scroll defined without scroll threshold, ignoring.");
        }
    });
})