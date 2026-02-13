// Input
const ejercicio = localStorage.getItem('ejercicio_actual');

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

    // TEXTO LATEX
    const texto = data.contenido;

    const pasos = separarPasosInteligente(texto);
    setPasos(pasos);

    if (getTotalPasos() > 0) {
        setPasoActual(1);
        actualizarPantalla(1);
        marcarPasoActual(1);
    }

    localStorage.removeItem('mathboard_data');
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
    const texto = input.value.trim();
    if (!texto) return alert('No hay contenido');

    const blob = new Blob([texto], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'ejercicio_math.txt';
    a.click();

    URL.revokeObjectURL(url);
}

function toggleModoDibujo() {
    setModoDibujar(!getModoDibujar());
    dom.btnDibujar.textContent = getModoDibujar()
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
