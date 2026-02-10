// =======================
// DOOM
// =======================

// Botones navegación
//const btnGenerar   = document.getElementById('btn-generar'); Inhabilitado
const btnAnterior  = document.getElementById('btn-anterior');
const btnSiguiente = document.getElementById('btn-siguiente');
const btnInicio    = document.getElementById('btn-inicio');
const btnFinal     = document.getElementById('btn-final');

// Botones utilidades
//const btnLimpiar = document.getElementById('btn-limpiar');
const btnGuardar = document.getElementById('btn-guardar');
const btnDibujar = document.getElementById('btn-dibujar');

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

btnAnterior.addEventListener('click', pasoAnterior);
btnSiguiente.addEventListener('click', pasoSiguiente);
btnInicio.addEventListener('click', irAlInicio);
btnFinal.addEventListener('click', irAlFinal);

//btnLimpiar.addEventListener('click', limpiarTodo);

btnGuardar.addEventListener('click', guardarEjercicio);

btnDibujar.addEventListener('click', toggleModoDibujo);


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
    btnDibujar.textContent = getModoDibujar()
        ? 'Desactivar Dibujo'
        : 'Activar Dibujo';
}
