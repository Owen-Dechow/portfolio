// @ts-check

/**
 * @param {string} section
 */
function displaySection(section) {
    document.querySelectorAll("section.show").forEach(e => { e.classList.remove("show"); });
    const element = document.querySelector("section#" + section);

    if (element) element.classList.add("show");
}

/**
 * @param {string} query
 */
function scrollToElement(query) {
    const element = document.querySelector(query);

    if (element) {
        element.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}
