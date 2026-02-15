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

// --- Notas ---
let notas = [];

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

function getHistorial() {
    return historial;
}

function getHistorialRedo() {
    return historialRedo;
}

function getNotas() {
    return notas;
}

function getNotaPaso(numeroPaso) {
    const encontrada = notas.find(n => n.id === numeroPaso);
    return encontrada ? encontrada.nota : "";
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

function setNotas(nuevasNotas) {
    notas = nuevasNotas;
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
    notas = [];
}
