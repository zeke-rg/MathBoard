const data = JSON.parse(localStorage.getItem('mathboard_data'));

if (!data) {
    alert("No hay datos para mostrar");
    window.location.href = "main.html";
}

document.getElementById('tituloBoard').textContent = data.titulo || "Sin título";

// aquí luego:
// renderizar LaTeX
// inicializar pasos
// habilitar dibujo
console.log("Contenido:", data.contenido);
