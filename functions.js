function renderizarPaso(textoPaso, numeroPaso) {
    /*const div = document.createElement('div');
    try {
        div.innerHTML = katex.renderToString(textoPaso, { throwOnError: false });
    } catch (error) {
        div.textContent = `Error en el formato`;
        console.error(error);
    }
    output.appendChild(div);*/
    
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
    output.appendChild(pasoDiv);
}

function actualizarPantalla(limit) {
    output.innerHTML = '';
    for (let i = 0; i < limit; i++) {
        renderizarPaso(allSteps[i], i + 1);
    }
    actIndex = limit;
    marcarPasoActual(actIndex);
    actualizarSizeSVG();
    actualizarVisibilidadTrazos();
}

function separarPasosInteligente(texto) {
    const lineas = texto.split('\n');

    const pasos = [];
    let bloqueActual = [];

    lineas.forEach(linea => {
        const limpia = linea.trim();

        if (limpia === '') {
            // Línea vacía → cerramos bloque si hay contenido
            if (bloqueActual.length > 0) {
                pasos.push(bloqueActual.join('\n'));
                bloqueActual = [];
            }
        } else {
            bloqueActual.push(limpia);
        }
    });

    // Último bloque (si no terminó con línea vacía)
    if (bloqueActual.length > 0) {
        pasos.push(bloqueActual.join('\n'));
    }

    return pasos;
}

//Paso Actual
function marcarPasoActual(numeroPaso) {
    const pasos = document.querySelectorAll('.paso');

    pasos.forEach(paso => {
        paso.classList.remove('actual');
    });

    const pasoActual = document.querySelector(
        `.paso[data-step="${numeroPaso}"]`
    );

    if (pasoActual) {
        pasoActual.classList.add('actual');
        scrollAlPasoActual();
    }
}

//Seguir Scroll Paso Actual
function scrollAlPasoActual() {
    const pasoActual = document.querySelector('.paso.actual');
    if (!pasoActual) return;

    const contenedor = output;

    const pasoRect = pasoActual.getBoundingClientRect();
    const contenedorRect = contenedor.getBoundingClientRect();

    const offset = pasoRect.top - contenedorRect.top;

    contenedor.scrollTop += offset - 20; // margen superior cómodo
}

//Estado Botones
function actualizarEstadoBotones() {
    const hayPasos = allSteps.length > 0;
    const hayInput = input.value.trim() !== '';

    btnAnterior.disabled = !hayPasos || actIndex <= 1;
    btnInicio.disabled   = !hayPasos || actIndex <= 1;

    btnSiguiente.disabled = !hayPasos || actIndex >= allSteps.length;
    btnFinal.disabled     = !hayPasos || actIndex >= allSteps.length;

    btnGenerar.disabled = !hayInput;
    btnLimpiar.disabled = !hayInput;
    btnGuardar.disabled = !hayInput;

    btnCargar.disabled = false; // siempre permitido fuera de modo dibujar
}


//Funcion Dibujar
function actualizarModoDibujar() {
    if (modoDibujar) {
        herramientaActual = 'lapiz';
        // Bloquear navegación
        btnAnterior.disabled = true;
        btnSiguiente.disabled = true;
        btnInicio.disabled = true;
        btnFinal.disabled = true;
        btnGenerar.disabled = true;
        btnGuardar.disabled = true;
        btnLimpiar.disabled = true;
        btnCargar.disabled = true;

        btnLapiz.disabled = false;
        btnBorrador.disabled = false;
        btnLinea.disabled = false;
        btnRectangulo.disabled = false;
        btnCirculo.disabled = false;
        btnFlecha.disabled = false;
        btnsColor.forEach(btn => btn.disabled = false);

        // Marcar estado en DOM
        document.body.classList.add('modo-dibujar');
    } else {
        // Restaurar estado normal
        herramientaActual = 'lapiz';
        btnBorrador.disabled = true;
        btnLapiz.disabled = true;
        btnLinea.disabled = true;
        btnRectangulo.disabled = true;
        btnCirculo.disabled = true;
        btnFlecha.disabled = true;
        btnsColor.forEach(btn => btn.disabled = true);

        document.body.classList.remove('modo-dibujar');
        actualizarEstadoBotones();
    }
}

//Actualizar Tamaño
function actualizarSizeSVG() {
    const outputWrapper = document.getElementById('output-wrapper');
    const drawLayer = document.getElementById('draw-layer');
    drawLayer.setAttribute('width', outputWrapper.offsetWidth);
    drawLayer.setAttribute('height', outputWrapper.offsetHeight);
}
