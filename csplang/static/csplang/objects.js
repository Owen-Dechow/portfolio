// @ts-check

export class ObjectFinder {
    /** @returns {HTMLTextAreaElement} */
    static code() {
        /** @type {HTMLTextAreaElement | null} */
        const code = document.querySelector("textarea#code");

        if (code)
            return code;

        throw new Error("Could not find code textarea.");
    }

    /** @returns {HTMLSelectElement} */
    static exampleSelect() {
        /** @type {HTMLSelectElement | null} */
        const element = document.querySelector("select#example-programs");

        if (element)
            return element;

        throw new Error("Could not find example-programs select.");
    }

    /** @returns {HTMLElement} */
    static output() {
        /** @type {HTMLElement | null} */
        const element = document.querySelector("#output");

        if (element)
            return element;

        throw new Error("Could not find output element.");
    }

    /** @returns {HTMLElement} */
    static highlighting() {
        /** @type {HTMLElement | null} */
        const element = document.querySelector("#highlighting");

        if (element)
            return element;

        throw new Error("Could not find highlighting element.");
    }

    /** @returns {HTMLElement} */
    static numbers() {
        /** @type {HTMLElement | null} */
        const element = document.querySelector("#numbers");

        if (element)
            return element;

        throw new Error("Could not find numbers element.");
    }

    /** @returns {HTMLElement} */
    static suggestions() {
        /** @type {HTMLElement | null} */
        const element = document.querySelector("#suggestions");

        if (element)
            return element;

        throw new Error("Could not find suggestions element.");
    }

    /** @returns {HTMLButtonElement} */
    static assignBtn() {
        /** @type {HTMLButtonElement | null} */
        const element = document.querySelector("button#assign-btn");

        if (element)
            return element;

        throw new Error("Could not find assign button.");
    }

    /** @returns {HTMLButtonElement} */
    static neqBtn() {
        /** @type {HTMLButtonElement | null} */
        const element = document.querySelector("button#neq-btn");

        if (element)
            return element;

        throw new Error("Could not find neq button.");
    }


    /** @returns {HTMLButtonElement} */
    static gteqBtn() {
        /** @type {HTMLButtonElement | null} */
        const element = document.querySelector("button#gteq-btn");

        if (element)
            return element;

        throw new Error("Could not find gteq button.");
    }

    /** @returns {HTMLButtonElement} */
    static lteqBtn() {
        /** @type {HTMLButtonElement | null} */
        const element = document.querySelector("button#lteq-btn");

        if (element)
            return element;

        throw new Error("Could not find lteq button.");
    }

    /** @returns {HTMLButtonElement} */
    static runBtn() {
        /** @type {HTMLButtonElement | null} */
        const element = document.querySelector("button#run-btn");

        if (element)
            return element;

        throw new Error("Could not find run button.");
    }

    /** @returns {HTMLButtonElement} */
    static clearBtn() {
        /** @type {HTMLButtonElement | null} */
        const element = document.querySelector("button#clear-btn");

        if (element)
            return element;

        throw new Error("Could not find clear button.");
    }

    /**
     * @param {() => HTMLElement} fn
     */
    static getExists(fn) {
        try {
            return fn();
        } catch {
            return null;
        }
    }
}
