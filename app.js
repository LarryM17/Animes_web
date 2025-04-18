document.addEventListener("DOMContentLoaded", () => {
document.body.classList.add('dark');

let userIsAdmin = false;

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const toggleFormBtn = document.getElementById("toggleForm");
const editBtn = document.getElementById("editTableBtn");
const filtroImportante = document.getElementById("filtroImportante");
const filtroEspera = document.getElementById("filtroEspera");

let editMode = false;
const formSection = document.getElementById("formSection");
const searchInput = document.getElementById("busqueda");
const exportBtn = document.getElementById("exportBtn");
const themeToggle = document.getElementById("themeToggle");
const animeForm = document.getElementById("animeForm");
const tableBody = document.querySelector("#animeTable tbody");

// Ocultar al inicio
logoutBtn.style.display = "none";
toggleFormBtn.style.display = "none";
exportBtn.style.display = "none";
themeToggle.style.display = "none";
searchInput.style.display = "none";
filtroImportante.parentElement.style.display = "none";
filtroEspera.parentElement.style.display = "none";
formSection.classList.add("hidden");
    editTableBtn.style.display = "none";
    editMode = false;
    editTableBtn.textContent = "✏️ Editar tabla";

firebase.auth().onAuthStateChanged(async user => {
  if (user) {
    userIsAdmin = true;

    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    toggleFormBtn.style.display = "inline-block";
    exportBtn.style.display = "inline-block";
    themeToggle.style.display = "inline-block";
    searchInput.style.display = "inline-block";
	filtroImportante.parentElement.style.display = "inline-block";
	filtroEspera.parentElement.style.display = "inline-block";
    formSection.classList.remove("hidden");
    editTableBtn.style.display = "inline-block";
	document.querySelector(".menu").classList.remove("hidden");
	document.querySelector(".table-container").classList.remove("hidden");
	document.querySelector("header").classList.remove("transparente");
	document.getElementById("welcomeBackground").classList.add("hidden");
    let editMode = false;
const editBtn = document.getElementById("editTableBtn");

editBtn.addEventListener("click", () => {
  editMode = !editMode;
  editBtn.textContent = editMode ? "🔒 Bloquear edición" : "✏️ Editar tabla";

  document.querySelectorAll("#animeTable tbody tr").forEach(row => {
    row.querySelectorAll("td").forEach((cell, i) => {
      if ([0, 1, 2, 3, 6].includes(i)) {
        if (editMode) {
          cell.setAttribute("contenteditable", "true");
        } else {
          cell.removeAttribute("contenteditable");
        }
      } else if ([4, 5].includes(i)) {
        const checkbox = cell.querySelector("input[type='checkbox']");
        if (checkbox) checkbox.disabled = !editMode;
      }
    });

    const acciones = row.querySelector("td:last-child");
    if (editMode && !acciones.querySelector(".guardarBtn")) {
      const guardarBtn = document.createElement("button");
      guardarBtn.className = "guardarBtn";
      guardarBtn.textContent = "💾";
      guardarBtn.onclick = () => guardarCambios(row.dataset.id, row);
      acciones.insertBefore(guardarBtn, acciones.firstChild);
    } else if (!editMode) {
      const btn = acciones.querySelector(".guardarBtn");
      if (btn) acciones.removeChild(btn);
    }
  });
});

async function guardarCambios(id, row) {
  const celdas = row.querySelectorAll("td");
  const data = {
    titulo: celdas[0].textContent.trim(),
    temporada: celdas[1].textContent.trim(),
    temporadaPendiente: celdas[2].textContent.trim(),
    fecha: celdas[3].textContent.trim(),
    importante: celdas[4].querySelector("input").checked,
    enEspera: celdas[5].querySelector("input").checked,
    comentarios: celdas[6].textContent.trim()
  };

  await db.collection("series").doc(id).update(data);
  alert("✅ Cambios guardados");
}


    loadData();
  } else {
    userIsAdmin = false;
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    toggleFormBtn.style.display = "none";
    exportBtn.style.display = "none";
    themeToggle.style.display = "none";
    searchInput.style.display = "none";
	filtroImportante.parentElement.style.display = "none";
	filtroEspera.parentElement.style.display = "none";
    formSection.classList.add("hidden");
	document.querySelector(".menu").classList.add("hidden");
	document.querySelector(".table-container").classList.add("hidden");
	document.querySelector("header").classList.add("transparente");
	document.getElementById("welcomeBackground").classList.remove("hidden");
    editBtn.style.display = "none";
    editMode = false;
    editBtn.textContent = "✏️ Editar tabla";
    tableBody.innerHTML = "";
  }
});

loginBtn.onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).catch(err => alert("Error al iniciar sesión"));
};

logoutBtn.onclick = () => firebase.auth().signOut();
toggleFormBtn.onclick = () => formSection.classList.toggle("hidden");
themeToggle.onclick = () => {
  if (document.body.classList.contains("dark")) {
    document.body.classList.remove("dark");
  } else {
    document.body.classList.add("dark");
  }
};

searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  for (const row of tableBody.rows) {
    const titulo = row.cells[0].textContent.toLowerCase();
    row.style.display = titulo.includes(term) ? "" : "none";
  }
});

animeForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const titulo = document.getElementById("titulo").value.trim();
  const temporada = document.getElementById("temporada").value.trim();
  const temporadaPendiente = document.getElementById("temporada_pendiente").value.trim();
  const fecha = document.getElementById("fechaEstreno").value;
  const importante = document.getElementById("importante").checked;
  const enEspera = document.getElementById("enEspera").checked;
  const comentarios = document.getElementById("comentarios").value;

  if (!titulo) return alert("El título es obligatorio");

  const existing = await db.collection("series").where("titulo", "==", titulo).get();
  if (!existing.empty) return alert("Ese título ya existe.");

  await db.collection("series").add({ titulo, temporada, temporadaPendiente, fecha, importante, enEspera, comentarios });
  animeForm.reset();
  loadData();
});

function loadData() {
  tableBody.innerHTML = "";
  db.collection("series").orderBy("fecha", "desc").get().then(snapshot => {
    snapshot.forEach(doc => {
      const d = doc.data();
      const fila = tableBody.insertRow();
	  fila.dataset.id = doc.id;
      fila.insertCell().textContent = d.titulo || "";
      fila.insertCell().textContent = d.temporada || "";
      fila.insertCell().textContent = d.temporadaPendiente || "";
      fila.insertCell().textContent = d.fecha || "";
      fila.insertCell().innerHTML = `<input type="checkbox" ${d.importante ? "checked" : ""} disabled />`;
      fila.insertCell().innerHTML = `<input type="checkbox" ${d.enEspera ? "checked" : ""} disabled />`;
      fila.insertCell().textContent = d.comentarios || "";
      fila.insertCell().innerHTML = userIsAdmin
        ? `<button onclick="borrarFila('${doc.id}')">🗑️</button>` : "";
    });
  });
}

window.borrarFila = function(id) {
  if (confirm("¿Eliminar este anime?")) {
    db.collection("series").doc(id).delete().then(loadData);
  }
}

exportBtn.onclick = () => {
  const headers = [
    "Título",
    "Última Temporada Vista",
    "Temporada en espera",
    "Fecha de Estreno",
    "Favorito",
    "En Espera",
    "Nota / Comentarios"
  ];

  const data = [];

  document.querySelectorAll("#animeTable tbody tr").forEach(row => {
    const cells = row.querySelectorAll("td");
    data.push([
      cells[0].textContent.trim(),
      cells[1].textContent.trim(),
      cells[2].textContent.trim(),
      cells[3].textContent.trim(),
      cells[4].querySelector("input")?.checked ? "TRUE" : "FALSE",
      cells[5].querySelector("input")?.checked ? "TRUE" : "FALSE",
      cells[6].textContent.trim()
    ]);
  });

  const allRows = [headers, ...data];
  const worksheet = XLSX.utils.aoa_to_sheet(allRows);

  // Estilo para los encabezados
  const headerStyle = {
    font: { bold: true },
    fill: { fgColor: { rgb: "CFE2F3" } }, // celeste claro
    alignment: { horizontal: "center" }
  };

  // Aplicar estilo a la fila 0 (encabezado)
  headers.forEach((_, i) => {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
    if (worksheet[cellRef]) {
      worksheet[cellRef].s = headerStyle;
    }
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Animes");

  XLSX.writeFile(workbook, "animes_firebase.xlsx");
};

const importBtn = document.getElementById("importBtn");
const importInput = document.getElementById("importInput");

importInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (rows.length === 0) return alert("⚠️ El archivo está vacío.");

    const headers = rows[0].map(h => h?.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim());

    const colIndex = {
      titulo: headers.findIndex(h => h.includes("titulo")),
      temporada: headers.findIndex(h => h.includes("ultima") || h.includes("temporada") && h.includes("vista")),
      temporadaPendiente: headers.findIndex(h => h.includes("pendiente")),
      fecha: headers.findIndex(h => h.includes("fecha")),
      importante: headers.findIndex(h => h.includes("favorito") || h.includes("importante")),
      enEspera: headers.findIndex(h => h.includes("espera")),
      comentarios: headers.findIndex(h => h.includes("comentario") || h.includes("nota"))
    };

    let errores = 0;
    const bodyRows = rows.slice(1);

    for (let row of bodyRows) {
      const titulo = row[colIndex.titulo]?.toString().trim();
      if (!titulo) continue;

     const toBool = val => ["TRUE", "VERDADERO"].includes((val || "").toString().trim().toUpperCase());

	 const data = {
		titulo,
		temporada: row[colIndex.temporada]?.toString().trim() || "",
		temporadaPendiente: row[colIndex.temporadaPendiente]?.toString().trim() || "",
		fecha: row[colIndex.fecha]?.toString().trim() || "",
		importante: toBool(row[colIndex.importante]),
		enEspera: colIndex.enEspera >= 0 ? toBool(row[colIndex.enEspera]) : false,
		comentarios: row[colIndex.comentarios]?.toString().trim() || ""
};


      try {
        await db.collection("series").add(data);
      } catch (err) {
        console.error("❌ Error al subir fila:", err);
        errores++;
      }
    }

    if (errores > 0) {
      alert(`⚠️ Importación completada con ${errores} errores`);
    } else {
      alert("✅ Importación completada correctamente");
    }

    loadData();
  };

  reader.readAsArrayBuffer(file);
});

function aplicarFiltros() {
  const termino = searchInput.value.toLowerCase();
  const filtrarImportante = filtroImportante.checked;
  const filtrarEspera = filtroEspera.checked;

  for (const row of tableBody.rows) {
    const titulo = row.cells[0].textContent.toLowerCase();
    const importante = row.cells[4].querySelector("input").checked;
    const enEspera = row.cells[5].querySelector("input").checked;

    const coincideTitulo = titulo.includes(termino);
    const coincideImportante = !filtrarImportante || importante;
    const coincideEspera = !filtrarEspera || enEspera;

    row.style.display = (coincideTitulo && coincideImportante && coincideEspera) ? "" : "none";
  }
}

searchInput.addEventListener("input", aplicarFiltros);
filtroImportante.addEventListener("change", aplicarFiltros);
filtroEspera.addEventListener("change", aplicarFiltros);

const menuToggle = document.getElementById("menuToggle");
const menuContent = document.querySelector(".menuContent");

menuToggle.onclick = () => {
  menuContent.classList.toggle("hidden");
};


});