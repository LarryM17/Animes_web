
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("animeForm");
  const tableBody = document.querySelector("#animeTable tbody");
  const toggleFormBtn = document.getElementById("toggleForm");
  const formSection = document.getElementById("formSection");
  const searchInput = document.getElementById("busqueda");
  const exportBtn = document.getElementById("exportBtn");
  const themeToggle = document.getElementById("themeToggle");
  let darkMode = false;

  toggleFormBtn.addEventListener("click", () => {
    formSection.classList.toggle("hidden");
  });

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    darkMode = !darkMode;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const titulo = document.getElementById("titulo").value.trim();
    if ([...tableBody.rows].some(row => row.cells[0].textContent === titulo)) {
      alert("Ya existe ese título.");
      return;
    }

    const temporada = document.getElementById("temporada").value;
    const fecha = document.getElementById("fechaEstreno").value;
    const importante = document.getElementById("importante").checked;
    const enEspera = document.getElementById("enEspera").checked;
    const comentarios = document.getElementById("comentarios").value;

    const fila = tableBody.insertRow();
    fila.insertCell().textContent = titulo;
    fila.insertCell().textContent = temporada;
    fila.insertCell().textContent = fecha;
    fila.insertCell().innerHTML = `<input type="checkbox" ${importante ? "checked" : ""} />`;
    fila.insertCell().innerHTML = `<input type="checkbox" ${enEspera ? "checked" : ""} />`;
    fila.insertCell().textContent = comentarios;
    const acciones = fila.insertCell();
    acciones.innerHTML = '<button class="borrar">🗑️</button>';

    fila.querySelector(".borrar").onclick = () => fila.remove();

    for (let i = 0; i < 6; i++) {
      if (i !== 3 && i !== 4) fila.cells[i].setAttribute("contenteditable", "true");
    }

    form.reset();
  });

  exportBtn.addEventListener("click", () => {
    const wb = XLSX.utils.table_to_book(document.getElementById("animeTable"));
    XLSX.writeFile(wb, "animes.xlsx");
  });

  searchInput.addEventListener("input", () => {
    const filtro = searchInput.value.toLowerCase();
    for (const row of tableBody.rows) {
      const titulo = row.cells[0].textContent.toLowerCase();
      row.style.display = titulo.includes(filtro) ? "" : "none";
    }
  });
});
