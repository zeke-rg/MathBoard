// ===============================
// PARSER DE PASOS (LaTeX)
// ===============================

function separarPasosInteligente(texto) {
    const lineas = texto.split('\n');

    const pasos = [];
    let bloqueActual = [];

    lineas.forEach(linea => {
        const limpia = linea.trim();

        if (limpia === '') {
            // Línea vacía → cerramos bloque si hay contenido
            if (bloqueActual.length > 0) {
                pasos.push(bloqueActual.join('\n'));
                bloqueActual = [];
            }
        } else {
            bloqueActual.push(limpia);
        }
    });

    // Último bloque (si no terminó con línea vacía)
    if (bloqueActual.length > 0) {
        pasos.push(bloqueActual.join('\n'));
    }

    return pasos;
}