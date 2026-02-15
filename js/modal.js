const modal = document.getElementById("myModal");
const closeBtn = document.getElementsByClassName("close")[0];

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") modal.style.display = "none";
});

closeBtn.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}