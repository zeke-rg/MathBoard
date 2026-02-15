const dom = {
    output: document.getElementById('output'),
    drawLayer: document.getElementById('draw-layer'),
    outputWrapper: document.getElementById('output-wrapper'),

    // Botones navegación
    //const btnGenerar   = document.getElementById('btn-generar'); Inhabilitado
    btnAnterior: document.getElementById('btn-anterior'),
    btnSiguiente: document.getElementById('btn-siguiente'),
    btnInicio: document.getElementById('btn-inicio'),
    btnFinal: document.getElementById('btn-final'),

    // Botones utilidades
    //const btnLimpiar = document.getElementById('btn-limpiar');
    btnGuardar: document.getElementById('btn-guardar'),
    btnDibujar: document.getElementById('btn-dibujar'),
    btnNotas: document.getElementById('btn-notas'),
    btnAlinear: document.getElementById('btn-alinear'),

    // HERRAMIENTAS
    btnBorrador: document.getElementById('btnBorrador'),
    btnLapiz: document.getElementById('btnLapiz'),
    btnLinea: document.getElementById('btnLinea'),
    btnRectangulo: document.getElementById('btnRectangulo'),
    btnCirculo: document.getElementById('btnCirculo'),
    btnFlecha: document.getElementById('btnFlecha'),

    btnsColor: document.querySelectorAll('[data-color]')
};
