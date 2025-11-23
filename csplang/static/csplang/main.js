// @ts-check

import { ObjectFinder } from "./objects.js";
import { highlightAllCodeBlocks } from "./highlights.js";
import { clearAutoCompleteBox, suggestCompletions } from "./autocomplete.js";
import { keydown, update, insertChar, setProgram, run } from "./editor.js";

document.addEventListener("DOMContentLoaded", () => {
    if (ObjectFinder.getExists(ObjectFinder.code)) {
        const code = ObjectFinder.code();
        code.addEventListener("click", clearAutoCompleteBox);
        code.addEventListener("keydown", keydown);
        code.addEventListener("change", update);
        code.addEventListener("input", () => { update(); suggestCompletions(); });

        ObjectFinder.assignBtn().addEventListener("click", () => { insertChar("←"); });
        ObjectFinder.neqBtn().addEventListener("click", () => { insertChar("≠"); });
        ObjectFinder.gteqBtn().addEventListener("click", () => { insertChar("≥"); });
        ObjectFinder.lteqBtn().addEventListener("click", () => { insertChar("≤"); });

        ObjectFinder.exampleSelect().addEventListener("change", setProgram);

        ObjectFinder.runBtn().addEventListener("change", run);
        ObjectFinder.clearBtn().addEventListener("change", () => { ObjectFinder.output().innerHTML = ""; });
    }

    highlightAllCodeBlocks();
})
