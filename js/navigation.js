// ===============================
// NAVEGACIÓN ENTRE PASOS
// ===============================

function irAlInicio() {
    if (!hayPasos()) return;
    if (modoAligned) toggleModoAligned();

    actualizarPantalla(1);
}


function irAlFinal() {
    if (!hayPasos()) return;
    if (modoAligned) toggleModoAligned();

    const total = getTotalPasos();
    actualizarPantalla(total);
}


function pasoSiguiente() {
    if (modoAligned) toggleModoAligned();
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
    if (modoAligned) toggleModoAligned();
    const actual = getPasoActual();
    if (actual <= 1) return;

    eliminarUltimoPasoRender();

    setPasoActual(actual - 1);

    marcarPasoActual(getPasoActual());
    actualizarVisibilidadTrazos();
    resaltarNotaActual(getPasoActual());
}

