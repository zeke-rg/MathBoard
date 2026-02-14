// ===============================
// STATE GLOBAL DE MATHBOARD
// ===============================

// --- Pasos del ejercicio ---
let pasos = [];        // Array de strings LaTeX
let pasoActual = 0;    // Índice del paso actual (1-based)

// --- Modo dibujo ---
let modoDibujar = false;

// --- Undo/Redo ---
let historial = [];
let historialRedo = [];

function isModoDibujar() {
    return modoDibujar;
}

function toggleModoDibujar() {
    modoDibujar = !modoDibujar;
    return modoDibujar;
}

// --- Undo/Redo ---
function limpiarRedo() {
    historialRedo = [];
}

function pushHistorial(accion) {
    historial.push(accion);
}

function pushRedo(accion) {
    historialRedo.push(accion);
}


// ===============================
// INICIALIZAR STATE
// ===============================
function inicializarState() {
    setPasos([]);
    setPasoActual(0);
    setModoDibujar(false);
}

// ===============================
// INICIALIZAR BOTONES
// ===============================

function inicializarBotonesDibujo() {
    dom.btnLapiz.disabled = true;
    dom.btnBorrador.disabled = true;
    dom.btnLinea.disabled = true;
    dom.btnRectangulo.disabled = true;
    dom.btnCirculo.disabled = true;
    dom.btnFlecha.disabled = true;

    dom.btnsColor.forEach(btn => btn.disabled = true);
}



// ===============================
// GETTERS
// ===============================
function getPasos() {
    return pasos;
}

function getPasoActual() {
    return pasoActual;
}

function getTotalPasos() {
    return pasos.length;
}

function getModoDibujar() {
    return modoDibujar;
}

function getHistorial() {
    return historial;
}

function getHistorialRedo() {
    return historialRedo;
}

// ===============================
// SETTERS
// ===============================
function setPasos(nuevosPasos) {
    pasos = nuevosPasos;
}

function setPasoActual(nuevoPaso) {
    pasoActual = nuevoPaso;
}

function setModoDibujar(valor) {
    modoDibujar = valor;
}


// ===============================
// HELPERS
// ===============================
function hayPasos() {
    return pasos.length > 0;
}

function esPrimerPaso() {
    return pasoActual <= 1;
}

function esUltimoPaso() {
    return pasoActual >= pasos.length;
}


// ===============================
// RESET GLOBAL
// ===============================
function resetState() {
    pasos = [];
    pasoActual = 0;
    modoDibujar = false;
}
