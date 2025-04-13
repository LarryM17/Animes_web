
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("animeForm");
    const table = document.getElementById("animeTable").getElementsByTagName("tbody")[0];
    const toggleFormButton = document.getElementById("toggleForm");
    const formSection = document.getElementById("formSection");

    toggleFormButton.addEventListener("click", () => {
        formSection.classList.toggle("hidden");
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const titulo = document.getElementById("titulo").value.trim();
        const genero = document.getElementById("genero").value.trim();
        const temporada = document.getElementById("temporada").value.trim();
        const estado = document.getElementById("estado").value.trim();

        // Comprobar si ya existe ese título
        const filas = table.querySelectorAll("tr");
        for (let fila of filas) {
            if (fila.cells[0] && fila.cells[0].textContent === titulo) {
                alert("Ese título ya está en la tabla.");
                return;
            }
        }

        const fila = table.insertRow();
        fila.insertCell().textContent = titulo;
        fila.insertCell().textContent = genero;
        fila.insertCell().textContent = temporada;
        fila.insertCell().textContent = estado;

        form.reset();
    });
});
