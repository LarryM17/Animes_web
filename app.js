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

function borrarFila(id) {
  if (confirm("¿Eliminar este anime?")) {
    db.collection("series").doc(id).delete().then(loadData);
  }
}

exportBtn.onclick = () => {
  const wb = XLSX.utils.table_to_book(document.getElementById("animeTable"));
  XLSX.writeFile(wb, "animes_firebase.xlsx");
};


const filtroImportante = document.getElementById("filtroImportante");
const filtroEspera = document.getElementById("filtroEspera");

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
