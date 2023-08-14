const cookieExperationTime = 365;

function toggle(e, s = undefined) {
    if (e.classList.contains("on")) {
        e.classList.remove("on");
        e.classList.add("off");

        if (s != undefined) {
            s.classList.remove("on");
            s.classList.add("off");
        }
    } else {
        e.classList.remove("off");
        e.classList.add("on");

        if (s != undefined) {
            s.classList.remove("off");
            s.classList.add("on");
        }
    }
}

function getCookie(cName) {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded.split("; ");
    let res;
    cArr.forEach((val) => {
        if (val.indexOf(name) === 0) res = val.substring(name.length);
    });
    return res;
}

function setCookie(cName, cValue, expDays) {
    let date = new Date();
    date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    const cookie = cName + "=" + cValue + "; " + expires + "; path=/";
    document.cookie = cookie;
}

function closeCookieBTN(e) {
    e.classList.add("closed");
    setCookie("closedCookieBTN", "true", cookieExperationTime);
}

async function setColorStyle(element) {
    let color = element.value;
    var body = document.getElementsByTagName("body")[0];
    setCookie("color", color, cookieExperationTime);

    let selectedElements = document.getElementsByClassName("color-selected");
    for (let i = 0; i < selectedElements.length; i++) {
        selectedElements[i].classList.remove("color-selected");
    }

    [
        "--prime",
        "--d-prime",
        "--background",
        "--light-text",
        "--dark-text",
        "--title-tag",
    ].forEach((el) => {
        body.style.setProperty(
            el,
            element.parentNode.style.getPropertyValue(el)
        );
    });

    element.parentNode.classList.add("color-selected");
}

window.addEventListener("DOMContentLoaded", (event) => {
    let footerText =
        "But sanctify Christ as Lord in your hearts, always being ready to make a defense to everyone who asks you to give an account for the hope that is in you, but with gentleness and respect;";

    // Footer
    window.onscroll = (event) => {
        let scroll = Math.abs(
            window.innerHeight + window.scrollY - document.body.offsetHeight
        );
        if (scroll <= 30) {
            document
                .getElementById("footer-type-out")
                .setAttribute("value", footerText);
            window.onscroll = () => { };
        }
    };
    // console.log(document.body.offsetHeight)
    if (window.innerHeight - document.body.offsetHeight > 0)
        document
            .getElementById("footer-type-out")
            .setAttribute("value", footerText);

    // Color Select
    (() => {
        let targetColor = getCookie("color");
        let colors = document.getElementsByClassName("color-option");
        let selected;

        for (let i = 0; i < colors.length; i++) {
            let color = colors[i];
            if (targetColor == color.value) {
                selected = color;
                color.parentNode.classList.add("color-selected");
            }
        }

        if (selected == undefined) selected = colors[0];
        selected.checked = true;
    })();

    // Cookies
    if (getCookie("closedCookieBTN")) {
        document.getElementById("cookie-warning").style.display = "none";
    }
});
