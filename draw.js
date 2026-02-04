const btnBorrador = document.getElementById('btnBorrador');
const btnLapiz = document.getElementById('btnLapiz');
const btnLinea = document.getElementById('btnLinea');
const btnRectangulo = document.getElementById('btnRectangulo');
const btnCirculo = document.getElementById('btnCirculo');
const btnFlecha = document.getElementById('btnFlecha');
const btnsColor = document.querySelectorAll('[data-color]');



// --- Variables ---
let modoDibujar = false;
let dibujando = false;
let pathActual = null;
let puntos = [];
let colorActual = '#000000';
let herramientaActual = 'lapiz';

// Botones por defecto
btnLapiz.disabled = true;
btnBorrador.disabled = true;
btnLinea.disabled = true;
btnRectangulo.disabled = true;
btnCirculo.disabled = true;
btnFlecha.disabled = true;
btnsColor.forEach(btn => btn.disabled = true);


// --- Funciones ---
function obtenerCoordenadasSVG(evento) {
    const rect = drawLayer.getBoundingClientRect();
    return {
        x: evento.clientX - rect.left,
        y: evento.clientY - rect.top
    };
}

function actualizarVisibilidadTrazos() {
    const trazos = drawLayer.querySelectorAll('path');
    trazos.forEach(trazo => {
        const paso = Number(trazo.dataset.step);
        trazo.style.display = paso <= actIndex ? 'block' : 'none';
    });
}

function terminarTrazo() {
    dibujando = false;
    pathActual = null;
    puntos = [];
}

//Actualizar Herramientas
function actualizarHerramientasModo() {
    if (modoDibujar) {
        herramientaActual = 'lapiz';
        btnBorrador.disabled = false;
        botonesColor.forEach(btn => btn.disabled = false);
    } else {
        herramientaActual = 'lapiz';
        btnBorrador.disabled = true;
        botonesColor.forEach(btn => btn.disabled = true);
    }
}

function crearPathInicial(x, y) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', colorActual);
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.dataset.step = actIndex;
    path.setAttribute('d', `M ${x} ${y}`);
    drawLayer.appendChild(path);
    return path;
}

function describeCircle(cx, cy, r){
    return `M ${cx} ${cy-r} 
            A ${r} ${r} 0 1 0 ${cx} ${cy+r} 
            A ${r} ${r} 0 1 0 ${cx} ${cy-r}`;
}

//Dibujar flecha
function dibujarFlecha(inicio, x, y, size=10) {
    // Línea principal
    let d = `M ${inicio.x} ${inicio.y} L ${x} ${y}`;

    // Ángulo de la línea
    const ang = Math.atan2(y - inicio.y, x - inicio.x);

    // Puntos de la punta
    const x1 = x - size * Math.cos(ang - Math.PI/6);
    const y1 = y - size * Math.sin(ang - Math.PI/6);
    const x2 = x - size * Math.cos(ang + Math.PI/6);
    const y2 = y - size * Math.sin(ang + Math.PI/6);

    // Agregar punta al path
    d += ` M ${x1} ${y1} L ${x} ${y} L ${x2} ${y2}`;
    return d;
}

// --- Eventos de dibujo ---
drawLayer.addEventListener('mousedown', (e) => {
    if (!modoDibujar) return;
    terminarTrazo();
    const { x, y } = obtenerCoordenadasSVG(e);

    // Borrador
    if (herramientaActual === 'borrador') {
        if (e.target.tagName === 'path') drawLayer.removeChild(e.target);
        return;
    }

    dibujando = true;
    puntos = [{x, y}];

    // Lápiz
    if (herramientaActual === 'lapiz') {
        pathActual = crearPathInicial(x, y);
    }

    // Líneas y formas
    if (['linea','rectangulo','circulo','flecha'].includes(herramientaActual)) {
        pathActual = crearPathInicial(x, y);
    }
    document.body.style.userSelect = 'none'; // desactiva selección
});

drawLayer.addEventListener('mousemove', (e) => {
    if (!modoDibujar || !dibujando || !pathActual) return;
    const { x, y } = obtenerCoordenadasSVG(e);

    if (herramientaActual === 'lapiz') {
        puntos.push({x, y});
        if (puntos.length < 2) return;

        let d = `M ${puntos[0].x} ${puntos[0].y}`;
        for (let i=1;i<puntos.length-1;i++){
            const p1 = puntos[i];
            const p2 = puntos[i+1];
            const cx = (p1.x+p2.x)/2;
            const cy = (p1.y+p2.y)/2;
            d += ` Q ${p1.x} ${p1.y} ${cx} ${cy}`;
        }
        pathActual.setAttribute('d', d);
    } else {
        // Figuras básicas: línea, rectángulo, círculo
        const inicio = puntos[0];
        let d = '';
        switch (herramientaActual) {
            case 'linea':
                d = `M ${inicio.x} ${inicio.y} L ${x} ${y}`;
                break;
            case 'rectangulo':
                const w = x - inicio.x;
                const h = y - inicio.y;
                d = `M ${inicio.x} ${inicio.y} L ${inicio.x + w} ${inicio.y} L ${inicio.x + w} ${inicio.y + h} L ${inicio.x} ${inicio.y + h} Z`;
                break;
            case 'circulo':
                const r = Math.sqrt((x - inicio.x) ** 2 + (y - inicio.y) ** 2);
                d = describeCircle(inicio.x, inicio.y, r);
                break;
            case 'flecha':
                d = dibujarFlecha(inicio, x, y);
                break;
        }
        pathActual.setAttribute('d', d);
    }
});

drawLayer.addEventListener('mouseup', terminarTrazo);
document.addEventListener('mouseup', () => {
    document.body.style.userSelect = 'auto'; // reactiva
    terminarTrazo();
});
drawLayer.addEventListener('mouseleave', () => {
    document.body.style.userSelect = 'auto'; // reactiva
    terminarTrazo();
});

//Manejo Colores
btnsColor.forEach(btn => {
    btn.addEventListener('click', () => {
        if (!modoDibujar) return;
        colorActual = btn.dataset.color;
    });
});


// --- Botón borrador ---
btnBorrador.addEventListener('click', () => {
    if (!modoDibujar) return;
    herramientaActual = herramientaActual === 'borrador' ? 'lapiz' : 'borrador';
});

// --- Botones de herramienta ---
btnLapiz.addEventListener('click', () => herramientaActual='lapiz');
btnBorrador.addEventListener('click', () => herramientaActual='borrador');
btnLinea.addEventListener('click', () => herramientaActual='linea');
btnRectangulo.addEventListener('click', () => herramientaActual='rectangulo');
btnCirculo.addEventListener('click', () => herramientaActual='circulo');
btnFlecha.addEventListener('click', () => herramientaActual='flecha');


// --- Botones de color ---
document.querySelectorAll('[data-color]').forEach(btn => {
    btn.addEventListener('click', () => {
        if (!modoDibujar) return;
        colorActual = btn.dataset.color;
    });
});
