// ===============================
// ESTADO DE DIBUJO
// ===============================

const svg = dom.drawLayer;

let herramientaActual = 'lapiz';

let dibujando = false;
let pathActual = null;
let puntos = [];

let colorActual = '#000000';
let strokeWidth = 2;

// ===============================
// UTILIDADES BASICAS
// ===============================
function obtenerCoordenadasSVG(evento) {
    const rect = svg.getBoundingClientRect();
    return {
        x: evento.clientX - rect.left,
        y: evento.clientY - rect.top
    };
}

function terminarTrazo() {
    dibujando = false;
    pathActual = null;
    puntos = [];
}

// ===============================
// CREAR FORMAS SVG
// ===============================

function crearPathInicial(x, y) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    path.setAttribute('stroke', colorActual);
    path.setAttribute('stroke-width', strokeWidth);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.dataset.step = getPasoActual();

    path.setAttribute('d', `M ${x} ${y}`);
    svg.appendChild(path);

    return path;
}

function crearDefinicionesSVG() {
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '7');
    marker.setAttribute('refX', '10');
    marker.setAttribute('refY', '3.5');
    marker.setAttribute('orient', 'auto');

    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
    polygon.setAttribute('fill', colorActual);

    marker.appendChild(polygon);
    defs.appendChild(marker);
    svg.appendChild(defs);
}


//RECTANGULO
function crearRectangulo(x, y) {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', 0);
    rect.setAttribute('height', 0);
    rect.setAttribute('stroke', colorActual);
    rect.setAttribute('stroke-width', strokeWidth);
    rect.setAttribute('fill', 'none');
    rect.dataset.step = getPasoActual();

    svg.appendChild(rect);
    return rect;
}

//CIRCULO
function crearCirculo(x, y) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', 0);
    circle.setAttribute('stroke', colorActual);
    circle.setAttribute('stroke-width', strokeWidth);
    circle.setAttribute('fill', 'none');
    circle.dataset.step = getPasoActual();

    svg.appendChild(circle);
    return circle;
}

//FLECHA
function crearFlecha(x, y) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

    line.setAttribute('x1', x);
    line.setAttribute('y1', y);
    line.setAttribute('x2', x);
    line.setAttribute('y2', y);

    line.setAttribute('stroke', colorActual);
    line.setAttribute('stroke-width', 2);
    line.setAttribute('marker-end', 'url(#arrowhead)');
    line.dataset.step = getPasoActual();

    svg.appendChild(line);
    return line;
}


// ===============================
// MOUSE DOWN
// ===============================

svg.addEventListener('mousedown', (e) => {
    if (!isModoDibujar()) return;

    terminarTrazo();
    dibujando = true;

    const { x, y } = obtenerCoordenadasSVG(e);
    puntos = [{ x, y }];

    if (herramientaActual === 'lapiz') {
        pathActual = crearPathInicial(x, y);
    }

    if (herramientaActual === 'rectangulo') {
        pathActual = crearRectangulo(x, y);
        pathActual.dataset.x0 = x;
        pathActual.dataset.y0 = y;
    }

    if (herramientaActual === 'circulo') {
        pathActual = crearCirculo(x, y);
        pathActual.dataset.x0 = x;
        pathActual.dataset.y0 = y;
    }

    if (herramientaActual === 'flecha') {
        pathActual = crearFlecha(x, y);
    }

});

// ===============================
// MOUSE MOVE
// ===============================

svg.addEventListener('mousemove', (e) => {
    if (!dibujando || !pathActual) return;

    const { x, y } = obtenerCoordenadasSVG(e);

    if (herramientaActual === 'lapiz') {
        puntos.push({ x, y });
        if (puntos.length < 3) return;

        let d = `M ${puntos[0].x} ${puntos[0].y}`;
        for (let i = 1; i < puntos.length - 1; i++) {
            const p1 = puntos[i];
            const p2 = puntos[i + 1];
            d += ` Q ${p1.x} ${p1.y} ${(p1.x + p2.x)/2} ${(p1.y + p2.y)/2}`;
        }
        pathActual.setAttribute('d', d);
    }

    if (herramientaActual === 'rectangulo') {
        const x0 = pathActual.dataset.x0;
        const y0 = pathActual.dataset.y0;
        pathActual.setAttribute('width', Math.abs(x - x0));
        pathActual.setAttribute('height', Math.abs(y - y0));
        pathActual.setAttribute('x', Math.min(x, x0));
        pathActual.setAttribute('y', Math.min(y, y0));
    }

    if (herramientaActual === 'circulo') {
        const x0 = pathActual.dataset.x0;
        const y0 = pathActual.dataset.y0;
        const r = Math.hypot(x - x0, y - y0);
        pathActual.setAttribute('r', r);
    }

    if (herramientaActual === 'flecha') {
        pathActual.setAttribute('x2', x);
        pathActual.setAttribute('y2', y);
    }

});

// ===============================
// MOUSE UP
// ===============================

svg.addEventListener('mouseup', terminarTrazo);
svg.addEventListener('mouseleave', terminarTrazo);
document.addEventListener('mouseup', terminarTrazo);

// ===============================
// INTEGRACION CON BOTONES
// ===============================

function setHerramienta(nombre) {
    herramientaActual = nombre;
}

