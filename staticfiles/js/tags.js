function elementFromHTML(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content;
}

customElements.define("type-out", class extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.style.setProperty("padding-right", "2px");
        this.style.setProperty("border-right", "2px solid");
        this.blink = false;
        setInterval(() => {
            if (this.blink) {
                this.style.setProperty("border-right-color", "transparent");
            } else {
                this.style.setProperty("border-right-color", "inherit");
            }
            this.blink = !this.blink;
        }, 500);
    }

    static get observedAttributes() {
        return ["value"];
    }

    attributeChangedCallback(name, oldValue, newVal) {
        if (name == "value") {
            this.speed = this.getAttribute("speed");
            if (this.speed == undefined) { this.speed = 0.1; }
            this.text = newVal;
            this.idx = 0;
            this.textContent = "";
            this.done = false;
            this.intervalPaused = false;
            this.interval = setInterval(() => {
                if (this.intervalPaused) { return; }

                this.textContent += this.text[this.idx];
                this.idx += 1;

                if (this.idx >= this.text.length) { clearInterval(this.interval); }
            }, this.speed * 1000);
        }
    }
});

customElements.define("sending-tag", class extends HTMLElement {
    constructor() {
        super();
        var templateContent = elementFromHTML(`
        <div>
            <div id="sending" class="sending">
                <div class="top">
                    <h1>Sending</h1>
                </div>
                <div class="bottom">
                    <span id="span2" style="--i:0s"></span>
                    <span id="span3" style="--i:0.1s"></span>
                    <span id="span4" style="--i:0.2s"></span>
                </div>
            </div>
            <style>
                .sending {
                    position: fixed;
                    z-index: 100;
                    top: 0;
                    left: 0;
                    display: none;
                    grid-template-columns: 100%;
                    grid-template-rows: 50%;
                    width: 100%;
                    height: 100%;
                    color: var(--light-text);
                    background: var(--transparent);
                    backdrop-filter: var(--blur)
                    }

                    .sending .top {
                        position: relative;
                        text-align: center;
                    }

                    .sending .top h1 {
                        position: absolute;
                        bottom: 0;
                        width: 100%;
                        margin-bottom: 20px;
                        font-size: 3em;
                    }

                    .sending .bottom {
                        display: flex;
                        justify-content: center;
                    }

                    .sending .bottom span {
                        display: block;
                        width: 10px;
                        height: 10px;
                        transform: translateY(-10px);
                        border-radius: 50%;
                        background-color: var(--light-text);
                        animation: dot 1.5s ease var(--i) infinite forwards;
                        margin-inline: 5px;
                    }

                    @keyframes dot {
                        0% {
                            transform: translateY(-10px)
                        }

                        50% {
                            transform: translateY(10px)
                        }

                        100% {
                            transform: translateY(-10px)
                        }
                    }
                </style>
            </div>
            `);

        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(templateContent.cloneNode(true));
    }

    static get observedAttributes() {
        return ["on"];
    }

    attributeChangedCallback(name, oldValue, newVal) {
        if (name == "on") {
            if (newVal == "true") {
                this.shadowRoot.getElementById("sending").style.display = "grid";
            } else if (newVal == "false") {
                this.shadowRoot.getElementById("sending").style.display = "none";
            }
        }
    }

});

customElements.define("dropdown-area", class extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.setAttribute("open", "false");
    }

    static get observedAttributes() {
        return [];
    }

    attributeChangedCallback(name, oldValue, newVal) {
    }

});

customElements.define("dropdown-title", class extends HTMLButtonElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.addEventListener("click", () => {
            var area = this.parentNode;
            if (area.tagName != "DROPDOWN-AREA") { return; }

            var content = area.getElementsByTagName("dropdown-content")[0];
            if (!content) { return; }

            var indicator = area.getElementsByTagName("dropdown-indicator")[0];

            var open = this.getAttribute("open") == "true";
            var height = this.getHeight(content);

            if (content.interval) {
                clearInterval(content.interval);
            }

            content.style.setProperty("--height", height + "px");

            setTimeout(() => {
                this.setAttribute("open", !open);
                area.setAttribute("open", !open);
                content.setAttribute("open", !open);
                if (indicator) { indicator.setAttribute("open", !open); }
            }, 0);

        });

        this.setAttribute("open", "false");
    }

    static get observedAttributes() {
        return [];
    }

    attributeChangedCallback(name, oldValue, newVal) {
    }

    getHeight(element) {
        element.style.setProperty("height", "fit-content");
        var height = element.clientHeight;
        element.style.removeProperty("height");
        return height;
    }

}, { extends: "button" });

customElements.define("dropdown-content", class extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.setAttribute("open", "false");
    }

    static get observedAttributes() {
        return ["open"];
    }

    attributeChangedCallback(name, oldValue, newVal) {
        var open = newVal === "true";
        if (open) {
            this.interval = setInterval(() => {
                this.parentNode.getElementsByTagName("dropdown-content")[0].style.setProperty("--height", "fit-content");
                clearInterval(this.interval);
            }, 500);
        }
    }

});

customElements.define("dropdown-indicator", class extends HTMLElement {
    constructor() {
        super();
        var templateContent = elementFromHTML(`
            <span>▲</span>
            `);

        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(templateContent.cloneNode(true));
    }

    connectedCallback() {
        this.setAttribute("open", "false");
    }
});