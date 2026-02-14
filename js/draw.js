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

function crearMarkerParaColor(color) {

    const id = `arrowhead-${color.replace('#', '')}`;

    if (svg.querySelector(`#${id}`)) return id;

    const defs = svg.querySelector('defs') ||
        svg.insertBefore(
            document.createElementNS("http://www.w3.org/2000/svg", "defs"),
            svg.firstChild
        );

    const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
    marker.setAttribute('id', id);
    marker.setAttribute('markerWidth', '8');
    marker.setAttribute('markerHeight', '8');
    marker.setAttribute('refX', '7');
    marker.setAttribute('refY', '4');
    marker.setAttribute('orient', 'auto');
    marker.setAttribute('markerUnits', 'strokeWidth');

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute('d', 'M 0 0 L 8 4 L 0 8');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '1.5');

    marker.appendChild(path);
    defs.appendChild(marker);

    return id;
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

    const markerId = crearMarkerParaColor(colorActual);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

    line.setAttribute('x1', x);
    line.setAttribute('y1', y);
    line.setAttribute('x2', x);
    line.setAttribute('y2', y);

    line.setAttribute('stroke', colorActual);
    line.setAttribute('stroke-width', strokeWidth);
    line.setAttribute('marker-end', `url(#${markerId})`);
    line.dataset.step = getPasoActual();

    svg.appendChild(line);
    return line;
}

// ===============================
// POINTER DOWN
// ===============================

svg.addEventListener('pointerdown', (e) => {

    if (!isModoDibujar()) return;

    svg.setPointerCapture(e.pointerId);

    terminarTrazo();
    dibujando = true;

    const { x, y } = obtenerCoordenadasSVG(e);
    puntos = [{ x, y }];

    if (herramientaActual === 'lapiz') {
        pathActual = crearPathInicial(x, y);
    }

    if (herramientaActual === 'linea') {
        pathActual = crearFlecha(x, y);
        pathActual.removeAttribute('marker-end');
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

    if (herramientaActual === 'borrador') {

        let elemento = e.target;

        while (elemento && elemento !== svg) {

            if (
                elemento.tagName === 'path' ||
                elemento.tagName === 'rect' ||
                elemento.tagName === 'circle' ||
                elemento.tagName === 'line'
            ) {
                svg.removeChild(elemento);
                break;
            }

            elemento = elemento.parentNode;
        }

        return;
    }

});

// ===============================
// POINTER MOVE
// ===============================

svg.addEventListener('pointermove', (e) => {

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

    if (herramientaActual === 'linea' || herramientaActual === 'flecha') {
        pathActual.setAttribute('x2', x);
        pathActual.setAttribute('y2', y);
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

    if (herramientaActual === 'borrador') {

        let elemento = e.target;

        while (elemento && elemento !== svg) {

            if (
                elemento.tagName === 'path' ||
                elemento.tagName === 'rect' ||
                elemento.tagName === 'circle' ||
                elemento.tagName === 'line'
            ) {
                svg.removeChild(elemento);
                break;
            }

            elemento = elemento.parentNode;
        }

        return;
    }

});

// ===============================
// POINTER UP
// =============================== 

svg.addEventListener('pointerup', (e) => {
    svg.releasePointerCapture(e.pointerId);
    terminarTrazo();
});

svg.addEventListener('pointerleave', terminarTrazo);

// ===============================
// POINTER LEAVE
// ==============================

svg.addEventListener('pointerleave', terminarTrazo);

// ===============================
// COLORES
// ===============================

dom.btnsColor.forEach(btn => {
    btn.addEventListener('click', () => {
        if (!isModoDibujar()) return;
        colorActual = btn.dataset.color;
    });
});


// ===============================
// INTEGRACION CON BOTONES
// ===============================

function setHerramienta(nombre) {
    herramientaActual = nombre;
}

// ===============================
// Modo Dibujo
// ===============================

function actualizarModoDibujar() {
    if (isModoDibujar()) {

        dom.btnAnterior.disabled = true;
        dom.btnSiguiente.disabled = true;
        dom.btnInicio.disabled = true;
        dom.btnFinal.disabled = true;
        dom.btnGenerar.disabled = true;
        dom.btnGuardar.disabled = true;
        dom.btnLimpiar.disabled = true;
        dom.btnCargar.disabled = true;

        document.body.classList.add('modo-dibujar');

    } else {

        document.body.classList.remove('modo-dibujar');

        actualizarEstadoBotones();
    }
}
