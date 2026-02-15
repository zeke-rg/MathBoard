const botonCrearMain = document.getElementById("botonCrearMain");
const botonCargarMain = document.getElementById("botonCargarMain");

botonCrearMain.addEventListener("click", () => {
    fetch("vistas/crear.html")
        .then(response => response.text())
        .then(data => {
            document.querySelector("#titulo-modal").innerHTML = "Nueva Presentación";
            document.querySelector("#contenido-modal").innerHTML = data;
            inicializarVistaCrear();

            
            // Mostramos el modal
            document.getElementById("myModal").style.display = "block";
        });
});

botonCargarMain.addEventListener("click", () => {
    fetch("vistas/cargar.html")
        .then(response => response.text())
        .then(data => {
            document.querySelector("#titulo-modal").innerHTML = "Cargar Archivo";
            document.querySelector("#contenido-modal").innerHTML = data;
            inicializarVistaCargar();
            
            // Mostramos el modal
            document.getElementById("myModal").style.display = "block";
        });
});

//Funciones Botones Modales
function inicializarVistaCrear() {
    const btnGenerar = document.getElementById('btnGenerarHome');

    if (!btnGenerar) return;

    btnGenerar.addEventListener('click', () => {
        const titulo = document.getElementById('inputTitulo').value.trim() || 'Ejercicio sin título';
        const contenido = document.getElementById('inputHome').value.trim();

        if (!contenido) {
            alert("Ingrese el contenido LaTeX");
            return;
        }

        localStorage.setItem('mathboard_data', JSON.stringify({
            titulo,
            contenido,
            origen: 'crear'
        }));

        document.getElementById("myModal").style.display = "none";

        window.location.href = "board.html";
    }, {once: true});
}

function inicializarVistaCargar(){
    // Lógica para la vista de CARGAR
    const dropZone = document.getElementById('drop-zone');
    const inputFisico = document.getElementById('inputCargarModal');
    const fileInfo = document.getElementById('file-info');
    const fileNameSpan = document.getElementById('file-name');

    if (dropZone) {
        // Eventos de arrastrar
        ['dragover', 'dragleave', 'drop'].forEach(evt => {
            dropZone.addEventListener(evt, (e) => {
                e.preventDefault();
                if (evt === 'dragover') dropZone.classList.add('drag-over');
                else dropZone.classList.remove('drag-over');
            });
        });

        // Evento de soltar archivo
        dropZone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length) procesarArchivo(files[0]);
        });

        // Evento de selección manual
        inputFisico.addEventListener('change', (e) => {
            if (e.target.files.length) procesarArchivo(e.target.files[0]);
        });
    }
}

function procesarArchivo(archivo) {
    const esTxt = archivo.type === "text/plain" || archivo.name.endsWith('.txt');
    const esMathboard = archivo.name.endsWith('.mathboard');

    if (!esTxt && !esMathboard) {
        alert("Por favor, sube un archivo .txt o .mathboard");
        return;
    }

    // Mostrar información en el modal
    document.getElementById('file-name').textContent = archivo.name;
    document.getElementById('file-info').style.display = "block";

    // Configurar el botón de confirmación
    document.getElementById('btn-confirmar-carga').onclick = () => {
        const lector = new FileReader();

        lector.onload = (e) => {
            if (esMathboard) {
                // Leer formato .mathboard
                try {
                    const data = JSON.parse(e.target.result);

                    if (!data.meta || !data.pasos) {
                        alert("El archivo .mathboard no es válido");
                        return;
                    }

                    localStorage.setItem('mathboard_data', JSON.stringify({
                        titulo: data.meta.titulo,
                        contenido: data.pasos.map(p => p.latex).join('\n\n'),
                        trazos: data.pasos.map(p => ({ id: p.id, trazos: p.trazos })),
                        notas: data.pasos.map(p => ({ id: p.id, nota: p.nota })),
                        origen: 'cargar'
                    }));

                } catch (err) {
                    alert("Error al leer el archivo .mathboard");
                    return;
                }

            } else {
                // Leer formato .txt legacy
                localStorage.setItem('mathboard_data', JSON.stringify({
                    titulo: archivo.name.replace('.txt', ''),
                    contenido: e.target.result,
                    trazos: [],
                    notas: [],
                    origen: 'cargar'
                }));
            }

            document.getElementById("myModal").style.display = "none";
            window.location.href = "board.html";
        };

        lector.readAsText(archivo);
    };
}
