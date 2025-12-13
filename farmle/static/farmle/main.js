// @ts-check

import { lowerWordList, wordList } from "./words.js";
import { targetWord } from "./targetWord.js";

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".guesses li").forEach((e, i) => {

        const input = e.getElementsByTagName("input")[0];

        input.addEventListener("input", e => {
            onTextInput(/** @type {KeyboardEvent} */(e));
        });

        input.addEventListener("keydown", e => {
            if (e.key == "Tab") {
                onAutoComplete(e); e.preventDefault();
            } else if (e.key == "Enter") {
                enterGuess(e, i);
            }
        });

        e.getElementsByTagName("button")[0].addEventListener("click", e => {
            enterGuess(e, i);
        });
    });

    const category = document.querySelector("#category");
    if (category) category.textContent = targetWord.category;
});

/**
 * @param {KeyboardEvent} event
 */
function onTextInput(event) {
    const elem = /** @type {HTMLInputElement} */(event.target);
    const validWords = wordList.filter(w => w.trim().toLowerCase().includes(elem.value.trim().toLowerCase())).slice(0, 15);
    const suggestions = elem.parentNode?.querySelector(".suggestions");
    closeSuggestions();

    if (!suggestions) return;

    suggestions.innerHTML = "";
    validWords.forEach((e, i) => {
        const li = document.createElement("li");
        const button = document.createElement("button");

        li.append(button);
        button.textContent = e;
        suggestions.append(li);
        button.addEventListener("click", e => {
            onAutoComplete(e, i);
        });
        suggestions.classList.add("show");
    });
}

/**
 * @param {Event} event
 * @param {number} [n]
 */
function onAutoComplete(event, n) {
    let elem = /** @type {HTMLInputElement} */(event.target);
    let parent = elem.closest(".guesses>li");
    let input = parent?.querySelector("input");
    let suggestions = parent?.querySelector(".suggestions");
    let btn = suggestions?.querySelectorAll("button")[n || 0];

    if (input && btn && btn.innerHTML) input.value = btn.innerHTML.trim();
    closeSuggestions();
    input?.focus();
}

/**
 * @param {Event} event
 * @param {number} i
 */
function enterGuess(event, i) {
    const li = /** @type {HTMLElement} */(event.target).closest(".guesses>li");
    const ipt = li?.querySelector("input");
    const btn = li?.closest(".guesses>li")?.querySelector("button");

    if (!ipt || !btn || !li) return;

    const value = ipt.value.trim().toLowerCase();
    if (!lowerWordList.includes(value)) return;

    ipt.toggleAttribute("disabled", true);
    btn.toggleAttribute("disabled", true);

    if (value.toLowerCase() == targetWord.word.toLowerCase()) {
        ipt.classList.add("correct");
        overlay(
            "You win!",
            `The term was "${targetWord.word}"`,
            `You guessed the term in ${i + 1} guess` + (i == 0 ? "!" : "es!")
        );
    } else if (i < 5) {
        ipt.classList.add("incorrect");
        addClue(li, i);

        const nextIpt = li.nextElementSibling?.querySelector("input");
        const nextBtn = li.nextElementSibling?.querySelector("button");
        if (!nextIpt || !nextBtn) return;

        nextIpt.removeAttribute("disabled");
        nextBtn.removeAttribute("disabled");
        nextIpt.focus();

    } else {
        ipt.classList.add("incorrect");
        addClue(li, i);
        overlay(
            "You lose :(",
            `The term was "${targetWord.word}"`,
        );
    }
}

function closeSuggestions() {
    document.querySelectorAll("ol.suggestions").forEach(e => {
        e.innerHTML = "";
        e.classList.remove("show");
    });
}

/**
 * @param {Element} li
 * @param {number} i
 */
function addClue(li, i) {
    const div = document.createElement("div");
    div.textContent = targetWord.clues[i];
    li.querySelector("ol.suggestions")?.replaceWith(div);
}

/**
 * @param {string} title
 * @param {string[]} notes
 */
function overlay(title, ...notes) {
    const div = document.createElement("div");
    div.classList.add("overlay");
    document.body.append(div);

    const h1 = document.createElement("h1");
    h1.textContent = title;
    div.append(h1);

    notes.forEach(note => {
        const p = document.createElement("p");
        p.textContent = note;
        div.append(p);
    });

    const btn = document.createElement("button");
    btn.addEventListener("click", () => {
        /** @type {Element} */(btn.parentNode).remove();
    });
    btn.textContent = "Close";
    div.append(btn);
    closeSuggestions();
}
