// @ts-check

import { ObjectFinder } from "./objects.js";
import { update } from "./editor.js";

/**
 * @typedef {HTMLDivElement & {callback: () => void}} CallbackDiv
 */

const words = [
    ["assign", "←", "operator", "←"],
    ["neq", "≠", "operator", "≠"],
    ["lteq", "≤", "operator", "≤"],
    ["gteq", "≥", "operator", "≥"],
    ["PROCEDURE", "keyword", "keyword", "PROCEDURE"],
    ["FOR", "keyword", "keyword", "FOR"],
    ["EACH", "keyword", "keyword", "EACH"],
    ["IN", "keyword", "keyword", "IN"],
    ["IF", "keyword", "keyword", "IF"],
    ["ELSE", "keyword", "keyword", "ELSE"],
    ["RETURN", "keyword", "keyword", "RETURN"],
    ["MOD", "keyword", "keyword", "MOD"],
    ["NOT", "keyword", "keyword", "NOT"],
    ["AND", "keyword", "keyword", "AND"],
    ["OR", "keyword", "keyword", "OR"],
    ["REPEAT", "keyword", "keyword", "REPEAT"],
    ["TIMES", "keyword", "keyword", "TIMES"],
    ["UNTIL", "keyword", "keyword", "UNTIL"],
    ["LENGTH", "builtin", "builtin", "LENGTH"],
    ["DISPLAY", "builtin", "builtin", "DISPLAY"],
    ["RANDOM", "builtin", "builtin", "RANDOM"],
    ["INPUT", "builtin", "builtin", "INPUT"],
    ["INSERT", "builtin", "builtin", "INSERT"],
    ["APPEND", "builtin", "builtin", "APPEND"],
    ["REMOVE", "builtin", "builtin", "REMOVE"],
    ["true", "boolean", "boolean", "true"],
    ["false", "boolean", "boolean", "false"]
];

/**
 * @param {string} a
 * @param {string} b
 */
function score(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();

    const sanitize = (/** @type {string} */ str) => str.replace(/[^a-z0-9]/gi, "");
    a = sanitize(a);
    b = sanitize(b);

    const lenA = a.length;
    const lenB = b.length;

    if (a === b) return 1.5;
    if (lenA === 0 || lenB === 0) return 0;

    let prev = Array(lenB + 1).fill(0);
    let curr = Array(lenB + 1).fill(0);

    for (let j = 0; j <= lenB; j++) prev[j] = j;

    for (let i = 1; i <= lenA; i++) {
        curr[0] = i;
        for (let j = 1; j <= lenB; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            curr[j] = Math.min(
                prev[j] + 1,
                curr[j - 1] + 1,
                prev[j - 1] + cost
            );
        }
        [prev, curr] = [curr, prev];
    }

    const distance = prev[lenB];
    const maxLen = Math.max(lenA, lenB);

    let similarity = 1 - distance / maxLen;
    if (a.startsWith(b)) similarity += 0.5;

    return similarity;
}

function positionSuggestionsBox() {
    const box = ObjectFinder.suggestions();
    const textarea = ObjectFinder.code();
    const selectionStart = textarea.selectionStart;

    // Create a hidden mirror div
    const div = document.createElement("div");
    const style = window.getComputedStyle(textarea);

    // Copy important styles so text matches
    [
        "fontFamily", "fontSize", "fontWeight", "fontStyle",
        "letterSpacing", "textTransform", "wordSpacing",
        "textIndent", "whiteSpace", "padding", "border",
        "boxSizing", "lineHeight"].forEach(prop => {
            div.style[prop] = style[prop];
        });

    div.style.position = "fixed";
    div.style.visibility = "hidden";
    div.style.whiteSpace = "pre-wrap";
    div.style.width = textarea.offsetWidth + "px";
    div.style.height = textarea.offsetHeight + "px";

    // Text before caret
    const textBeforeCaret = textarea.value.substring(0, selectionStart);
    div.textContent = textBeforeCaret;

    // Add a marker span at caret
    const span = document.createElement("span");
    span.textContent = "\u200b"; // zero-width space
    div.appendChild(span);

    document.body.appendChild(div);

    const rect = span.getBoundingClientRect();

    const parentRect =
        /** @type {HTMLElement} */
        (box.parentNode || document.body).getBoundingClientRect();

    // Position box relative to textarea + caret
    const taRect = textarea.getBoundingClientRect();
    box.style.position = "absolute";
    box.style.left = taRect.left + rect.left - div.getBoundingClientRect().left + window.scrollX - parentRect.left - 30 + "px";
    box.style.top = taRect.top - box.offsetHeight + rect.top - div.getBoundingClientRect().top + window.scrollY - 10 - parentRect.top + "px";

    // Cleanup
    document.body.removeChild(div);
}

const maxOptions = 20;

/**
 * @param {string} key
 */
export function autoCompleteSendKey(key) {
    if (completions.length) {
        if (key == "Tab") {
            completions[completeTarget].callback();
            return true;
        }

        if (key == "ArrowUp") {
            completions[completeTarget].classList.remove("complete-target");
            completeTarget += 1;

            if (completeTarget >= completions.length)
                completeTarget = 0;

            completions[completeTarget].classList.add("complete-target");

            return true;
        }

        if (key == "ArrowDown") {
            completions[completeTarget].classList.remove("complete-target");
            completeTarget -= 1;

            if (completeTarget < 0)
                completeTarget = completions.length - 1;

            completions[completeTarget].classList.add("complete-target");
            return true;
        }

        if (key == "Escape" || key == "ArrowLeft" || key == "ArrowRight") {
            clearAutoCompleteBox();
        }
    }

    return false;
}

export function clearAutoCompleteBox() {
    ObjectFinder.suggestions().style.display = "none";
    completions = [];
}

let completeTarget = 20;

/** @type CallbackDiv[] */
let completions = [];

/**
 * @param {string} text
 * @param {number} cursorPos
 */
function getAllWords(text, cursorPos) {
    const cleaned = text.replace(/\/\/[^\n]*/g, '').replace(/"[^"]*"/g, '');

    const allWords = cleaned.match(/\b[a-zA-Z_]+\b/g) || [];

    return allWords.filter(word => {
        const left = text.slice(0, cursorPos).match(/[a-zA-Z0-9_]+$/);
        const right = text.slice(cursorPos).match(/^[a-zA-Z0-9_]+/);
        const currentWord = (left ? left[0] : '') + (right ? right[0] : '');
        return currentWord !== word;
    });
}


export function suggestCompletions() {
    const suggestionsBox = ObjectFinder.suggestions();
    const code = ObjectFinder.code();

    const caretPos = code.selectionStart;
    const beforeCaret = code.value.slice(0, caretPos);
    const afterCaret = code.value.slice(caretPos);

    completions = [];
    completeTarget = 0;

    // Match only the last alphanumeric "word" before caret
    const match = beforeCaret.match(/([a-zA-Z_]+)$/);
    const query = match ? match[0].toLowerCase() : "";

    suggestionsBox.innerHTML = "";

    suggestionsBox.removeAttribute("style");
    if (!query) {
        suggestionsBox.style.display = "none";
        return;
    };

    const localWords = words.map(([key, display, klass, val]) => [key, display, klass, val]);

    // Sort all words by similarity using the key
    const allWords = getAllWords(code.value, caretPos);
    allWords.forEach(w => {
        const exists = localWords.some(([key]) => key == w);
        if (!exists && !query.includes(w)) {
            localWords.push([w, "user", "user", w]); // add with same display form
        }
    });

    const sorted = localWords
        .map(([key, display, klass, val]) => ({ key, display, score: score(key, query), klass, val }))
        .sort((a, b) => b.score - a.score);


    sorted.forEach(({ key, display, klass, val }) => {
        if (completions.length < maxOptions) {
            const div =
                /** @type {CallbackDiv} */
                (document.createElement("div"));

            div.classList.add("highlight");

            if (completions.length == 0)
                div.classList.add("complete-target");

            div.innerHTML = `<span>${key}</span><span class="${klass}">${display}</span>`;

            div.callback = () => {
                const newBeforeCaret = beforeCaret.replace(/([a-zA-Z_]+)$/, val);
                code.value = newBeforeCaret + afterCaret;
                const newCaretPos = newBeforeCaret.length;
                code.focus();
                code.setSelectionRange(newCaretPos, newCaretPos);
                suggestionsBox.innerHTML = "";

                update();
                clearAutoCompleteBox();
            };


            completions.push(div);

            suggestionsBox.appendChild(div);
        }
    });

    positionSuggestionsBox();
};
