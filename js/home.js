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
    });
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
    if (archivo.type !== "text/plain" && !archivo.name.endsWith('.txt')) {
        alert("Por favor, sube un archivo de texto (.txt)");
        return;
    }

    // Mostrar información en el modal
    document.getElementById('file-name').textContent = archivo.name;
    document.getElementById('file-info').style.display = "block";

    // Configurar el botón de confirmación
    document.getElementById('btn-confirmar-carga').onclick = () => {
        const lector = new FileReader();
        lector.onload = (e) => {
            localStorage.setItem('mathboard_data', JSON.stringify({
                titulo: archivo.name.replace('.txt', ''),
                contenido: e.target.result,
                origen: 'cargar'
            }));

            document.getElementById("myModal").style.display = "none";

            window.location.href = "board.html";
        };

        lector.readAsText(archivo);
    };
}

// --- Undo/Redo ---
document.addEventListener("keydown", (e) => {

    if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        undo();
    }

    if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        redo();
    }

});
