class FrameworkUtils {

    routeError = "error404";
    cssTag = "#cssRender";
    jsTag = "#jsRender";
    htmlTag = "main";

    indexName = "index";
    headerName = "header";
    footerName = "footer";

    urlParams = new URLSearchParams(window.location.search);

    constructor() {

        this.autoInit();

    }

    async loadHtml(target, tag) {

        target += ".html";

        if (!this.checkRoute(target)) {
            console.error(`FATAL ERROR, error HTML not found: ${target}`);
            return;
        }

        fetch(target)
            .then(response => response.text())
            .then(data => document.querySelector(tag).innerHTML = data);

    }

    async loadCss(target, tag) {

        target += ".css";

        if (!this.checkRoute(target)) {
            console.error(`FATAL ERROR, error CSS not found: ${target}`);
            return;
        }

        let link = document.querySelector(tag);
        link.href = target;

    }

    async loadScript(target, tag) {

        target += ".js";

        if (!this.checkRoute(target)) {
            console.error(`FATAL ERROR, error Script not found: ${target}`);
            return;
        }

        let script = document.querySelector(tag);
        script.src = target;

    }

    async renderize(target) {

        let interval = await this.loandingProcess();
        let route = `src/${target}/${target}`;
        let comprobar = await this.checkRoute(`src/${target}`);

        if (!comprobar) {

            if (target == this.routeError) {
                console.error(`FATAL ERROR, error route not found: ${this.routeError}`);
                return;
            }

            clearInterval(interval);
            this.renderize(this.routeError);
            return;
        }

        this.loadCss(route, this.cssTag)
            .then(await this.loadScript(route, this.jsTag))
            .then(await this.loadHtml(route, this.htmlTag))
            .then(clearInterval(interval));

    }

    async checkRoute(route) {
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

    async autoInit() {

        this.loadHtml(`includes/html/${this.headerName}`, "header");
        this.loadHtml(`includes/html/${this.footerName}`, "footer");

        if (this.urlParams.has("target")) {

            this.renderize(urlParams.get("target"));

        } else {

            this.renderize(this.indexName);

        }

    }

    async loandingProcess() {
        let intervalo = null;

        await this.loadHtml("includes/html/loading", "main")

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

                }, 500);

            });

        return intervalo;
    }

};

let frameworkUtils = new FrameworkUtils();