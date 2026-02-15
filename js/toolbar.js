document.getElementById("btnUndo")
    .addEventListener("click", undo);

document.getElementById("btnRedo")
    .addEventListener("click", redo);

document.getElementById("btn-limpiarDibujo")
    .addEventListener("click", limpiarDibujo);

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

//ATAJOS TECLADO
// --- Undo/Redo ---
document.addEventListener("keydown", (e) => {

    if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        undo();
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        redo();
    }

});