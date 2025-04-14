
let userIsAdmin = false;

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const toggleFormBtn = document.getElementById("toggleForm");
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
formSection.classList.add("hidden");

firebase.auth().onAuthStateChanged(async user => {
  if (user) {
    userIsAdmin = true;

    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    toggleFormBtn.style.display = "inline-block";
    exportBtn.style.display = "inline-block";
    themeToggle.style.display = "inline-block";
    searchInput.style.display = "inline-block";
    formSection.classList.remove("hidden");

    loadData();
  } else {
    userIsAdmin = false;
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    toggleFormBtn.style.display = "none";
    exportBtn.style.display = "none";
    themeToggle.style.display = "none";
    searchInput.style.display = "none";
    formSection.classList.add("hidden");
    tableBody.innerHTML = "";
  }
});

loginBtn.onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).catch(err => alert("Error al iniciar sesión"));
};

logoutBtn.onclick = () => firebase.auth().signOut();
toggleFormBtn.onclick = () => formSection.classList.toggle("hidden");
themeToggle.onclick = () => document.body.classList.toggle("dark");

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
