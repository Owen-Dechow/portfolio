// @ts-check

export function highlightAllCodeBlocks() {
    document.querySelectorAll("code").forEach(e => {
        const text = e.getAttribute("val") || e.innerHTML;

        e.innerHTML = highlight(text);
        e.classList.add("highlight");

        if (e.hasAttribute("val")) {
            e.style.whiteSpace = "pre";
        }
    });
}

/**
 * @param {string} text
 */
export function highlight(text) {
    text = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    if (text[text.length - 1] == "\n") {
        text += " ";
    }

    /* @type [string, RegExp][] */
    const rules = [
        ["operator", /[{}()\[\],←≤≥≠=\+\*-]/g],
        ["lt", /&lt;/g],
        ["gt", /&gt;/g],
        ["keyword", /\b(FOR|EACH|IN|IF|ELSE|RETURN|MOD|NOT|AND|OR|REPEAT|TIMES|UNTIL|PROCEDURE)\b/g],
        ["builtin", /\b(RANDOM|DISPLAY|LENGTH|INPUT|REMOVE|INSERT|APPEND)\b/g],
        ["boolean", /\b(true|false)\b/g],
        ["number", /\b\d+\b/g],
        ["comment", /\/\/.*/g],
        ["string", /"[^"]*"/gs],
    ];

    rules.forEach(e => {
        text = text.replace(e[1], (/** @type {string} */ match) => {
            return `<span class='${e[0]}'>${match}</span>`;
        });
    });

    return text;
}
