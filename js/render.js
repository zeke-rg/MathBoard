// ===============================
// RENDER PRINCIPAL
// ===============================
function inicializarRender() {
    actualizarSizeSVG();
}


function renderizarPaso(textoPaso, numeroPaso) {
    const pasoDiv = document.createElement('div');
    pasoDiv.classList.add('paso');
    pasoDiv.dataset.step = numeroPaso;

    const mathDiv = document.createElement('div');
    mathDiv.classList.add('math');

    try {
        mathDiv.innerHTML = katex.renderToString(textoPaso, {
            throwOnError: false,
            displayMode: true
        });
    } catch (error) {
        mathDiv.textContent = 'Error en el formato';
        console.error(error);
    }

    pasoDiv.appendChild(mathDiv);
    dom.output.appendChild(pasoDiv);
}


// Renderiza desde 1 hasta N
function actualizarPantalla(hastaPaso) {
    limpiarOutput();

    const pasos = getPasos();

    for (let i = 0; i < hastaPaso; i++) {
        renderizarPaso(pasos[i], i + 1);
    }

    setPasoActual(hastaPaso);

    marcarPasoActual(hastaPaso);
    actualizarSizeSVG();
    actualizarVisibilidadTrazos();
    resaltarNotaActual(hastaPaso);
}

// Eliminar ultimo paso
function eliminarUltimoPasoRender() {
    const ultimo = dom.output.lastElementChild;
    if (ultimo) dom.output.removeChild(ultimo);
}



// ===============================
// UI HELPERS
// ===============================

function limpiarOutput() {
    dom.output.innerHTML = '';
    //dom.drawLayer.innerHTML = '';
}



function marcarPasoActual(paso) {
    document.querySelectorAll('.paso').forEach(el => {
        el.classList.remove('active');
    });

    const actual = document.querySelector(`.paso[data-step="${paso}"]`);
    if (actual) {
        actual.classList.add('active');
        actual.scrollIntoView({ behavior: 'smooth', block: 'center' });
        scrollAlPasoActual();
    }
}

function scrollAlPasoActual() {
    const pasoActual = dom.output.querySelector('.paso.active');
    if (!pasoActual) return;

    const contenedor = dom.output;

    const pasoRect = pasoActual.getBoundingClientRect();
    const contenedorRect = contenedor.getBoundingClientRect();

    const offset = pasoRect.top - contenedorRect.top;

    contenedor.scrollTop += offset - 20;
}



// ===============================
// SVG / DIBUJO
// ===============================

function actualizarVisibilidadTrazos() {
    const pasoActual = getPasoActual();

    dom.drawLayer
        .querySelectorAll('[data-step]')
        .forEach(path => {
            const paso = Number(path.dataset.step);
            path.style.display = paso <= pasoActual ? 'block' : 'none';
        });
}

function actualizarSizeSVG() {
    if (!dom.outputWrapper || !dom.drawLayer) return;

    dom.drawLayer.setAttribute('width', dom.outputWrapper.offsetWidth);
    dom.drawLayer.setAttribute('height', dom.outputWrapper.offsetHeight);
    /*drawLayer.setAttribute('width', rect.width);
    drawLayer.setAttribute('height', rect.height);*/
}
