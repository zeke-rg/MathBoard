// ===============================
// NAVEGACIÓN ENTRE PASOS
// ===============================

function irAlInicio() {
    if (!hayPasos()) return;

    actualizarPantalla(1);
}


function irAlFinal() {
    if (!hayPasos()) return;

    const total = getTotalPasos();
    actualizarPantalla(total);
}


function pasoSiguiente() {
    const actual = getPasoActual();
    const total = getTotalPasos();

    if (actual >= total) return;

    renderizarPaso(getPasos()[actual], actual + 1);
    setPasoActual(actual + 1);

    marcarPasoActual(getPasoActual());
    actualizarVisibilidadTrazos();
    resaltarNotaActual(getPasoActual());
}


function pasoAnterior() {
    const actual = getPasoActual();
    if (actual <= 1) return;

    eliminarUltimoPasoRender();

    setPasoActual(actual - 1);

    marcarPasoActual(getPasoActual());
    actualizarVisibilidadTrazos();
    resaltarNotaActual(getPasoActual());
}

