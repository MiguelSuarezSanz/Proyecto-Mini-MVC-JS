async function renderize(ruta, etiqueta) {
    fetch(ruta)
    .then(response => response.text())
    .then(data => document.querySelector(etiqueta).innerHTML = data); 
}

async function loadView(target) {
    let intervalo = loadInit();
    let route = `src/${target}/${target}`;
    loadCSS(`${route}.css`)
    .then(loadScript(`${route}.js`))
    .then(renderize(`${route}.html`, "main"))
    .then(clearInterval(intervalo));
}

async function loadCSS(target) {
    let link = document.querySelector('#cssRender');
    link.href = target;
}

async function loadScript(target) {
    let script = document.querySelector('#jsRender');
    script.src = target;
}


async function autoInit() {
    renderize("includes/html/header.html","header");
    renderize("includes/html/footer.html","footer");
    var urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("target")) {
        loadView(urlParams.get("target"));
    } else {
        loadView("index");
    }
}

async function loadInit() {
    return renderize("includes/html/loading.html","main")
    .then(()=>{
        return setInterval(()=>{
        
            let puntos = document.querySelector(".puntos");
            let puntosText = puntos.innerHTML;
            let numMaxPuntos = 3;

            if (puntosText.length != numMaxPuntos) {
                puntos.innerHTML += ".";
            } else {
                puntos.innerHTML = "";
            }
        
        },500)

    });
}