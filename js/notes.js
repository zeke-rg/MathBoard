// ===============================
// PANEL DE NOTAS
// ===============================

function inicializarNotas() {
    const pasos = getPasos();
    const listaNotas = document.getElementById('lista-notas');
    listaNotas.innerHTML = '';

    pasos.forEach((_, index) => {
        const numeroPaso = index + 1;
        const notaGuardada = getNotaPaso(numeroPaso);

        const item = document.createElement('div');
        item.classList.add('nota-item');
        item.id = `nota-item-${numeroPaso}`;
        item.dataset.paso = numeroPaso;

        // Header con label y botón toggle
        const header = document.createElement('div');
        header.classList.add('nota-header');

        const label = document.createElement('div');
        label.classList.add('nota-label');
        label.textContent = `📌 Paso ${numeroPaso}`;

        const btnToggle = document.createElement('button');
        btnToggle.classList.add('btn-toggle-nota');
        btnToggle.textContent = '🔽';
        btnToggle.title = 'Mostrar/ocultar nota';

        header.appendChild(label);
        header.appendChild(btnToggle);

        // Textarea editable
        const textarea = document.createElement('textarea');
        textarea.classList.add('nota-texto');
        textarea.placeholder = 'Agregar nota...';
        textarea.value = notaGuardada;
        textarea.dataset.paso = numeroPaso;

        // Toggle individual
        btnToggle.addEventListener('click', () => {
            const visible = !textarea.classList.contains('panel-notas-hidden');
            textarea.classList.toggle('panel-notas-hidden');
            btnToggle.textContent = visible ? '▶️' : '🔽';
        });

        // Guardar en estado al editar
        textarea.addEventListener('input', () => {
            actualizarNota(numeroPaso, textarea.value);
        });

        item.appendChild(header);
        item.appendChild(textarea);
        listaNotas.appendChild(item);
    });

    resaltarNotaActual(getPasoActual());
}


function resaltarNotaActual(numeroPaso) {
    document.querySelectorAll('.nota-item').forEach(el => {
        el.classList.remove('activa');
        // Ocultar notas de pasos futuros
        const paso = parseInt(el.dataset.paso);
        if (paso > numeroPaso) {
            el.classList.add('panel-notas-hidden');
        } else {
            el.classList.remove('panel-notas-hidden');
        }
    });

    // Marcar la actual
    const actual = document.getElementById(`nota-item-${numeroPaso}`);
    if (actual) {
        actual.classList.add('activa');
        actual.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}


function actualizarNota(numeroPaso, texto) {
    const notas = getNotas();
    const existente = notas.find(n => n.id === numeroPaso);

    if (existente) {
        existente.nota = texto;
    } else {
        notas.push({ id: numeroPaso, nota: texto });
    }

    setNotas(notas);
}


function togglePanelNotas() {
    const panel = document.getElementById('panel-notas');
    panel.classList.toggle('panel-notas-hidden');
}

function toggleTodasLasNotas() {
    const textareas = document.querySelectorAll('.nota-texto');
    const btnToggleAll = document.getElementById('btn-toggle-all-notas');
    
    // Si alguna está visible, ocultamos todas
    const hayVisible = Array.from(textareas).some(
        t => !t.classList.contains('panel-notas-hidden')
    );

    textareas.forEach(textarea => {
        const btn = textarea.previousSibling; // no funciona bien así
    });

    if (hayVisible) {
        textareas.forEach(t => t.classList.add('panel-notas-hidden'));
        document.querySelectorAll('.btn-toggle-nota')
            .forEach(b => b.textContent = '▶️');
        btnToggleAll.textContent = '👁️ Mostrar todas';
    } else {
        textareas.forEach(t => t.classList.remove('panel-notas-hidden'));
        document.querySelectorAll('.btn-toggle-nota')
            .forEach(b => b.textContent = '🔽');
        btnToggleAll.textContent = '🙈 Ocultar todas';
    }
}