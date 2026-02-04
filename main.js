const input = document.getElementById('input');
const btnGenerar = document.getElementById('btn-generar');
const btnAnterior = document.getElementById('btn-anterior');
const btnSiguiente = document.getElementById('btn-siguiente');
const btnInicio = document.getElementById('btn-inicio');
const btnFinal = document.getElementById('btn-final');
const btnLimpiar = document.getElementById('btn-limpiar');
const btnGuardar = document.getElementById('btn-guardar');
const btnCargar = document.getElementById('btn-cargar');
const inputCargar = document.getElementById('inputCargar');
const output = document.getElementById('output');
const btnDibujar = document.getElementById('btn-dibujar');



//Variables Capas
const drawLayer = document.getElementById('draw-layer');
const outputWrapper = document.getElementById('output-wrapper');

let allSteps = [];
let actIndex = 0;


btnGenerar.addEventListener('click', () => {
    const text = input.value;

    /*Separar y Refinar Input
    allSteps = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '')
    */
    //Separar Pasos Inteligentes
    allSteps = separarPasosInteligente(text);


    if (allSteps.length > 0) {
        actualizarPantalla(1);
        marcarPasoActual(1);
        actualizarEstadoBotones();
    }else {
        //Limpiar Output
        output.innerHTML = '';

        //Establecer Index
        actIndex = 0;
    }
    actualizarSizeSVG();
    
});

//Limpiar
btnLimpiar.addEventListener('click', () => {
    input.value = '';
    output.innerHTML = '';
    drawLayer.innerHTML = '';
    allSteps = [];
    actIndex = 0;
    actualizarEstadoBotones();
    actualizarSizeSVG();
});

//Ir al Primer Paso
btnInicio.addEventListener('click', () => {
    if (allSteps.length > 0) {
        actualizarPantalla(1);
        marcarPasoActual(1);
        actualizarSizeSVG();
        actualizarVisibilidadTrazos();
        actualizarEstadoBotones();
    }
});

//Mostrar Paso Siguiente
btnSiguiente.addEventListener('click', () => {

    if (actIndex < allSteps.length) {
        renderizarPaso(allSteps[actIndex], actIndex + 1);
        actIndex++;
        marcarPasoActual(actIndex);
        actualizarSizeSVG();
        actualizarVisibilidadTrazos();
        actualizarEstadoBotones();
    }
});

//Mostrar Paso Anterior
btnAnterior.addEventListener('click', () => {
    if (actIndex > 1) {
        output.removeChild(output.lastChild);
        actIndex--;
        marcarPasoActual(actIndex);
        actualizarSizeSVG();
        actualizarVisibilidadTrazos();
        actualizarEstadoBotones();
    }
});

//Ir al Ultimo Paso
btnFinal.addEventListener('click', () => {
    if (allSteps.length > 0) {
        actualizarPantalla(allSteps.length);
        marcarPasoActual(allSteps.length);
        actualizarSizeSVG();
        actualizarVisibilidadTrazos();
        actualizarEstadoBotones();
    }
});

//Guardar Ejercicio
btnGuardar.addEventListener('click', () => {
    const contenido = input.value;
    if(!contenido) return alert('No hay contenido para guardar');

    const blob = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');

    enlace.href = url;
    enlace.download = 'ejercicio_math.txt';
    enlace.click();
    URL.revokeObjectURL(url);
});

//Cargar Ejercicio
btnCargar.addEventListener('click', () => {
    inputCargar.click();
    actualizarSizeSVG();
});

//Archivo Cargado
inputCargar.addEventListener('change', (evento) => {
    const archivo = evento.target.files[0];
    if(!archivo) return;
    
    const lector = new FileReader();
    lector.onload = (e) => {
        input.value = e.target.result;
        btnGenerar.click();
        actualizarEstadoBotones();
    };
    lector.readAsText(archivo);

    evento.target.value = '';
});

//Boton Dibujar
btnDibujar.addEventListener('click', () => {
    modoDibujar = !modoDibujar;
    actualizarModoDibujar();
    btnDibujar.textContent = modoDibujar ? 'Desactivar Modo Dibujo' : 'Activar Modo Dibujo';
});
