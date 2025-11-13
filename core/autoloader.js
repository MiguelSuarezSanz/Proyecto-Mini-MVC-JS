async function loadHtml(target, tag) {

    target += ".html";

    if (!checkRoute(target)) {
        console.error(`FATAL ERROR, error HTML not found: ${target}`);
        return;
    }

    fetch(target)
        .then(response => response.text())
        .then(data => document.querySelector(tag).innerHTML = data);

}

async function loadCss(target, tag) {

    target += ".css";

    if (!checkRoute(target)) {
        console.error(`FATAL ERROR, error CSS not found: ${target}`);
        return;
    }

    let link = document.querySelector(tag);
    link.href = target;

}

async function loadScript(target, tag) {

    target += ".js";

    if (!checkRoute(target)) {
        console.error(`FATAL ERROR, error Script not found: ${target}`);
        return;
    }

    let script = document.querySelector(tag);
    script.src = target;

}

async function renderize(target) {

    let interval = await loandingProcess();
    let route = `src/${target}/${target}`;
    let comprobar = await checkRoute(`src/${target}`);

    if (!comprobar) {

        if (target == routeError) {
            console.error(`FATAL ERROR, error route not found: ${routeError}`);
            return;
        }

        clearInterval(interval);
        renderize(routeError);
        return;
    }

    loadCss(route, cssTag)
        .then(loadScript(route, jsTag))
        .then(loadHtml(route, htmlTag))
        .then(clearInterval(interval));

}

async function checkRoute(route) {
    try {

        const response = await fetch(route);

        if (!response.ok) {
            return false;
        }
        return true;

    } catch (error) {
        return false;
    }

}

async function autoInit() {

    loadHtml(`includes/html/${headerName}`, "header");
    loadHtml(`includes/html/${footerName}`, "footer");

    var urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("target")) {

        renderize(urlParams.get("target"));

    } else {

        renderize(indexName);

    }

}

async function loandingProcess() {
    let intervalo = null;

    await loadHtml("includes/html/loading", "main")

        .then(() => {

            intervalo = setInterval(() => {

                let puntos = document.querySelector(".puntos");
                let puntosText = puntos.innerHTML;
                let numMaxPuntos = 3;

                if (puntosText.length != numMaxPuntos) {
                    puntos.innerHTML += ".";
                } else {
                    puntos.innerHTML = "";
                }

            }, 500)

        });

    return intervalo;
}

let routeError = "error404";
let cssTag = "#cssRender";
let jsTag = "#jsRender";
let htmlTag = "main";

let indexName = "index";
let headerName = "header";
let footerName = "footer";