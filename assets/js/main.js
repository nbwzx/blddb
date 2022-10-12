/*
    Copyright 2022 Jim "JimOfLeisure" Nelson
    https://github.com/JimOfLeisure/html5up-phantom-plus | @JimOfLeisure
    Free for personal and commercial use under the CCA 3.0 license (https://creativecommons.org/licenses/by/3.0/)

    This file is a vanillajs rewrite of main.js from:
    Phantom by HTML5 UP
    html5up.net | @ajlkn
    Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

document.addEventListener("DOMContentLoaded", () => {
    const body = document.querySelector("body");
    enhanceForms();
    // enableMenu(body);
    removePreload(body);
});

function wrapInner(parent, wrapper, attribute, attributevalue) {
    // This function from https://codepen.io/kenjiroart/pen/qBmONJ
    //   It is meant to replace the functionality of jQuery's $.wrapInner
    if (typeof wrapper === "string") {
        wrapper = document.createElement(wrapper);
    }
    const div = parent.appendChild(wrapper).setAttribute(attribute, attributevalue);

    while (parent.firstChild !== wrapper) {
        wrapper.appendChild(parent.firstChild);
    }
}

function wrapOuter(element, wrapper, attribute, attributevalue) {
    // Adapting from wrapInner
    if (typeof wrapper === "string") {
        wrapper = document.createElement(wrapper);
    }
    attribute && wrapper.setAttribute(attribute, attributevalue);
    // To ensure the wrapper is in the same sibling-related position as element
    element.parentElement.insertBefore(wrapper, element);
}

function removePreload(body) {
    // Play initial animations on page load.
    //   Wait 100ms to remove is-preload to ensure DOM has had time to update
    setTimeout(() => body.classList.remove("is-preload"), 100);
}

// Touch?
//   Original sets is-touch based on browser detection
//   Will replace that with @media(hover: none) in scss instead

function enhanceForms() {
    // Forms.
    // Find all textareas in forms and loop through each
    Array.from(document.querySelectorAll("form textarea")).forEach((textarea) => {
    // Add wrapper div, set some style and attribute
        wrapOuter(textarea, "div", "class", "textarea-wrapper");
        textarea.setAttribute("rows", "1");
        textarea.style.overflow = "hidden";
        textarea.style.resize = "none";

        // Trim leading and trailing whitespace in textarea on focus change and ctrl-enter
        const trimElement = (element) => element.value = element.value.trim();
        ["blur", "focus"].forEach((eventName) => textarea.addEventListener(eventName, (event) => trimElement(event.target)));
        textarea.addEventListener("keydown", (event) => {
            if (event.code === 13 && event.ctrlKey) {
                event.preventDefault();
                event.stopPropagation();
                trimElement(event.target);
            }
        });

        // Auto-size the height of the textarea
        const setHeight = (element) => {
            element.style.height = "auto";
            element.style.height = `${element.scrollHeight}px`;
        };
        // Set height on initial load
        setHeight(textarea);
        // Monitor events to resize
        ["input", "blur", "focus"].forEach((eventName) => textarea.addEventListener(eventName, (event) => setHeight(event.target)));

        // Select text on tab-out
        //   This is broken, but it's broken in the original code, too
        //   It exits the field and doesn't select
        //   It will select the text if youchange keyup to keydown,
        //   But then the selection is irrelevant when the focus is lost
        //   You can make it work with keydown and event.preventDefault(),
        //     But that prevents you from being able to exit the field with tab
        textarea.addEventListener("keyup", (event) => {
            if (event.code === "Tab") {
                event.target.select();
            }
        });

        // Limit textarea height for "mobile"
        // Original code used browser detection; I'll just assume if
        //   it can't hover we'll limit the height
        if (matchMedia("(hover: none)").matches) {
            textarea.style["max-height"] = "10em";
            textarea.style.overflow = "auto";
        }
    });
}

function enableMenu(body) {
    // Menu.
    const menu = document.querySelector("#menu");
    wrapInner(menu, "div", "class", "inner");

    let menuIsDebouncing = false;
    const menuDebounced = () => {
        if (!menuIsDebouncing) {
            setTimeout(() => menuIsDebouncing = false, 350);
            menuIsDebouncing = true;
            return true;
        }
        return false;
    };
    const menuMove = {
        "hide": () => menuDebounced() && body.classList.remove("is-menu-visible"),
        "show": () => menuDebounced() && body.classList.add("is-menu-visible"),
        "toggle": () => menuDebounced() && body.classList.toggle("is-menu-visible")
    };

    // The original script moves #menu to the bottom of body
    // Why though?
    //   Ok, the styles only work right when it's down there
    //   Not sure why it's not just there in the first place
    body.appendChild(menu);

    // This adds the animated X icon to close the menu
    //   I don't know why it's being added with script
    //   I'm just aping the original code so far
    const close = document.createElement("a");
    close.href = "#menu";
    close.classList.add("close");
    close.innerText = "Close";
    menu.appendChild(close);

    // Add menu toggle to appropriate link targets
    Array.from(document.querySelectorAll("[href=\"#menu\"]")).forEach((el) => el.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        menuMove.toggle();
    }));

    // Prevents unhandled clicks in #menu from propagating to body to close menu
    menu.addEventListener("click", (event) => {
        event.stopPropagation();
    // The original code on link click stops propagation and changes the
    // location after a delay. I'm not gonna do that.
    });

    // Hides menu when clicking on body
    body.addEventListener("click", (event) => {
        menuMove.hide();
    });

    // Close menu on ESC key pressed
    body.addEventListener("keydown", (event) => {
        if (event.code === "Escape") {
            menuMove.hide();
        }
    });
}
