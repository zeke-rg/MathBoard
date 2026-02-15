// =======================
// INICIALIZACIÓN
// =======================

document.addEventListener('DOMContentLoaded', () => {
    inicializarState();
    inicializarRender();
    //inicializarDraw();
    //inicializarNavegacion();
    inicializarBoard();
});



// =======================
// FUNCIONES BOARD
// =======================

function inicializarBoard() {
    const data = JSON.parse(localStorage.getItem('mathboard_data'));

    if (!data || !data.contenido) {
        alert('No hay ejercicio cargado');
        window.location.href = 'home.html';
        return;
    }

    // Título
    const tituloEl = document.getElementById('titulo-ejercicio');
    if (tituloEl) {
        tituloEl.textContent = data.titulo || 'Ejercicio';
    }

    // Pasos LaTeX
    const pasos = separarPasosInteligente(data.contenido);
    setPasos(pasos);

    if (getTotalPasos() > 0) {
        setPasoActual(1);
        actualizarPantalla(1);
        marcarPasoActual(1);
    }

    // Reconstituir trazos
    if (data.trazos && data.trazos.length > 0) {
        reconstituirTrazos(data.trazos);
    }

    // Guardar notas en estado
    if (data.notas && data.notas.length > 0) {
        setNotas(data.notas);
    }

    localStorage.removeItem('mathboard_data');
    inicializarNotas();
}

function reconstituirTrazos(trazasPorPaso) {
    trazasPorPaso.forEach(({ id, trazos }) => {
        trazos.forEach(trazo => {
            let el;

            if (trazo.tipo === 'path') {
                el = document.createElementNS("http://www.w3.org/2000/svg", "path");
                el.setAttribute('d', trazo.d);
                el.setAttribute('fill', 'none');
                el.setAttribute('stroke-linecap', 'round');
                el.setAttribute('stroke-linejoin', 'round');
            }

            if (trazo.tipo === 'rect') {
                el = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                el.setAttribute('x', trazo.x);
                el.setAttribute('y', trazo.y);
                el.setAttribute('width', trazo.width);
                el.setAttribute('height', trazo.height);
                el.setAttribute('fill', 'none');
            }

            if (trazo.tipo === 'circle') {
                el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                el.setAttribute('cx', trazo.cx);
                el.setAttribute('cy', trazo.cy);
                el.setAttribute('r', trazo.r);
                el.setAttribute('fill', 'none');
            }

            if (trazo.tipo === 'line') {
                el = document.createElementNS("http://www.w3.org/2000/svg", "line");
                el.setAttribute('x1', trazo.x1);
                el.setAttribute('y1', trazo.y1);
                el.setAttribute('x2', trazo.x2);
                el.setAttribute('y2', trazo.y2);
                if (trazo.markerEnd) {
                    const color = trazo.color;
                    const markerId = crearMarkerParaColor(color);
                    el.setAttribute('marker-end', `url(#${markerId})`);
                }
            }

            if (el) {
                el.setAttribute('stroke', trazo.color);
                el.setAttribute('stroke-width', trazo.strokeWidth);
                el.dataset.step = id;
                svg.appendChild(el);
            }
        });
    });

    // Actualizar visibilidad según paso actual
    actualizarVisibilidadTrazos();
}

// =======================
// EVENTOS
// =======================

//btnGenerar.addEventListener('click', generarPresentacion); Inhabilitado

dom.btnAnterior.addEventListener('click', pasoAnterior);
dom.btnSiguiente.addEventListener('click', pasoSiguiente);
dom.btnInicio.addEventListener('click', irAlInicio);
dom.btnFinal.addEventListener('click', irAlFinal);

//btnLimpiar.addEventListener('click', limpiarTodo);

dom.btnGuardar.addEventListener('click', guardarEjercicio);
dom.btnNotas.addEventListener('click', togglePanelNotas);

dom.btnDibujar.addEventListener('click', toggleModoDibujo);

//HERRAMIENTAS
dom.btnLapiz.addEventListener('click', () => herramientaActual = 'lapiz');
dom.btnBorrador.addEventListener('click', () => herramientaActual = 'borrador');
dom.btnLinea.addEventListener('click', () => herramientaActual = 'linea');
dom.btnRectangulo.addEventListener('click', () => herramientaActual = 'rectangulo');
dom.btnCirculo.addEventListener('click', () => herramientaActual = 'circulo');
dom.btnFlecha.addEventListener('click', () => herramientaActual = 'flecha');



// =======================
// ACCIONES
// =======================

/*function generarPresentacion() {
    const texto = input.value.trim();
    if (!texto) return;

    cargarPasosDesdeTexto(texto);
    irAPrimerPaso();
} Inhabilitado */

function limpiarTodo() {
    limpiarEstado();
    output.innerHTML = '';
    drawLayer.innerHTML = '';
}

function guardarEjercicio() {
    const pasos = getPasos();
    if (!pasos || pasos.length === 0) return alert('No hay contenido');

    // Construir objeto .mathboard
    const mathboard = {
        meta: {
            version: "1.0",
            titulo: document.getElementById('titulo-ejercicio').textContent || 'Sin título',
            autor: "",
            fecha: new Date().toISOString().split('T')[0]
        },
        pasos: pasos.map((latex, index) => {
            const numeroPaso = index + 1;

            // Recopilar trazos del paso
            const trazos = [];
            dom.drawLayer.querySelectorAll(`[data-step="${numeroPaso}"]`).forEach(el => {
                if (el.tagName === 'path') {
                    trazos.push({
                        tipo: 'path',
                        color: el.getAttribute('stroke'),
                        strokeWidth: el.getAttribute('stroke-width'),
                        d: el.getAttribute('d')
                    });
                }
                if (el.tagName === 'rect') {
                    trazos.push({
                        tipo: 'rect',
                        color: el.getAttribute('stroke'),
                        strokeWidth: el.getAttribute('stroke-width'),
                        x: el.getAttribute('x'),
                        y: el.getAttribute('y'),
                        width: el.getAttribute('width'),
                        height: el.getAttribute('height')
                    });
                }
                if (el.tagName === 'circle') {
                    trazos.push({
                        tipo: 'circle',
                        color: el.getAttribute('stroke'),
                        strokeWidth: el.getAttribute('stroke-width'),
                        cx: el.getAttribute('cx'),
                        cy: el.getAttribute('cy'),
                        r: el.getAttribute('r')
                    });
                }
                if (el.tagName === 'line') {
                    trazos.push({
                        tipo: 'line',
                        color: el.getAttribute('stroke'),
                        strokeWidth: el.getAttribute('stroke-width'),
                        x1: el.getAttribute('x1'),
                        y1: el.getAttribute('y1'),
                        x2: el.getAttribute('x2'),
                        y2: el.getAttribute('y2'),
                        markerEnd: el.getAttribute('marker-end') || null
                    });
                }
            });

            return {
                id: numeroPaso,
                latex: latex,
                nota: getNotaPaso(numeroPaso),
                trazos: trazos
            };
        })
    };

    // Exportar como .mathboard
    const blob = new Blob([JSON.stringify(mathboard, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${mathboard.meta.titulo}.mathboard`;
    a.click();

    URL.revokeObjectURL(url);
}

function toggleModoDibujo() {
    setModoDibujar(!isModoDibujar());
    dom.btnDibujar.textContent = isModoDibujar()
        ? 'Desactivar Dibujo'
        : 'Activar Dibujo';
}

// board.js

function actualizarEstadoBotones() {
    const hayPasos = getTotalPasos() > 0;
    const hayInput = dom.input.value.trim() !== '';
    const pasoActual = getPasoActual();
    const total = getTotalPasos();

    dom.btnAnterior.disabled = !hayPasos || pasoActual <= 1;
    dom.btnInicio.disabled   = !hayPasos || pasoActual <= 1;

    dom.btnSiguiente.disabled = !hayPasos || pasoActual >= total;
    dom.btnFinal.disabled     = !hayPasos || pasoActual >= total;

    dom.btnGenerar.disabled = !hayInput;
    dom.btnLimpiar.disabled = !hayInput;
    dom.btnGuardar.disabled = !hayInput;

    dom.btnCargar.disabled = false;
}
