// @ts-check

import { ObjectFinder } from "./objects.js";
import { examplePrograms } from "./examples.js";
import { autoCompleteSendKey } from "./autocomplete.js";
import { execute } from "./execute.js";
import { CSPError } from "./error.js";
import { highlight } from "./highlights.js";

export function loadPrograms() {
    const code = ObjectFinder.code();
    code.innerHTML = examplePrograms.default;

    const examples = ObjectFinder.exampleSelect();;

    Object.keys(examplePrograms).forEach(e => {
        if (!examples.value)
            examples.value = e;

        const opt = document.createElement("option");
        opt.value = e;
        opt.textContent = e;

        examples.append(opt);
    });

    setProgram();
}

/**
 * @param {KeyboardEvent} event
 */
export function keydown(event) {
    const code = ObjectFinder.code();
    let text = code.value;


    if (autoCompleteSendKey(event.key)) {
        event.preventDefault();
        return;
    }

    if (event.key == "Tab") {
        event.preventDefault();

        let before_tab = text.slice(0, code.selectionStart);
        let after_tab = text.slice(code.selectionEnd, code.value.length);
        let cursor_pos = code.selectionEnd + 4;

        code.value = before_tab + "    " + after_tab;

        // move cursor
        code.selectionStart = cursor_pos;
        code.selectionEnd = cursor_pos;

        update();
    }
};

/**
 * @param {string} ch
 */
export function insertChar(ch) {
    /** @type {HTMLTextAreaElement} */
    const code = ObjectFinder.code();

    const start = code.selectionStart;
    const end = code.selectionEnd;

    // Use setRangeText so Ctrl-Z works
    code.setRangeText(ch, start, end, "end");

    // Refocus the textarea
    code.focus();

    update();
};

export function setProgram() {
    const code = ObjectFinder.code();
    const examples = ObjectFinder.exampleSelect();

    code.value = examplePrograms[examples.value];
    update();
};

export function run() {
    ObjectFinder.output().innerHTML = "";

    const text = ObjectFinder.code().value;

    try {
        execute(text);
    } catch (e) {
        console.error(e);

        if (e instanceof CSPError)
            e.printout(text);
    }
};


export function update() {
    const code = ObjectFinder.code();
    const text = highlight(code.value);

    let nums = "";
    text.split("\n").forEach((_, i) => { nums += i + 1 + "\n"; });

    ObjectFinder.numbers().innerHTML = nums;
    ObjectFinder.highlighting().innerHTML = text;
};
