
let userIsAdmin = false;

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const form = document.getElementById("animeForm");
const tableBody = document.querySelector("#animeTable tbody");
const toggleFormBtn = document.getElementById("toggleForm");
const formSection = document.getElementById("formSection");
const searchInput = document.getElementById("busqueda");
const exportBtn = document.getElementById("exportBtn");
const themeToggle = document.getElementById("themeToggle");

firebase.auth().onAuthStateChanged(async user => {
  if (user) {
    const rolesDoc = await db.collection("roles").doc(user.uid).get();
    userIsAdmin = rolesDoc.exists && rolesDoc.data().admin === true;

    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    toggleFormBtn.style.display = userIsAdmin ? "inline-block" : "none";
    formSection.classList.toggle("hidden", !userIsAdmin);

    loadData();
  } else {
    userIsAdmin = false;
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    toggleFormBtn.style.display = "none";
    formSection.classList.add("hidden");
    tableBody.innerHTML = "";
  }
});

loginBtn.onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider).catch(e => alert("Error al iniciar sesión"));
};

logoutBtn.onclick = () => firebase.auth().signOut();

toggleFormBtn.onclick = () => formSection.classList.toggle("hidden");

themeToggle.onclick = () => document.body.classList.toggle("dark");

form.addEventListener("submit", async e => {
  e.preventDefault();
  const titulo = document.getElementById("titulo").value.trim();
  const temporada = document.getElementById("temporada").value.trim();
  const temporadaPendiente = document.getElementById("temporada_pendiente").value.trim();
  const fecha = document.getElementById("fechaEstreno").value;
  const importante = document.getElementById("importante").checked;
  const enEspera = document.getElementById("enEspera").checked;
  const comentarios = document.getElementById("comentarios").value;

  const existing = await db.collection("series").where("titulo", "==", titulo).get();
  if (!existing.empty) return alert("Ya existe ese anime.");

  await db.collection("series").add({ titulo, temporada, temporadaPendiente, fecha, importante, enEspera, comentarios });
  form.reset();
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
      const btns = fila.insertCell();
      if (userIsAdmin) {
        const del = document.createElement("button");
        del.textContent = "🗑️";
        del.onclick = () => {
          
    if (confirm("¿Estás seguro de que quieres borrar esta serie?")) {
      const backup = { ...d };
      db.collection("series").doc(doc.id).delete().then(() => {
        loadData();
        mostrarDeshacer(backup);
      });
    }
    
        };
        btns.appendChild(del);
      }
    });
  });
}

exportBtn.onclick = () => {
  const wb = XLSX.utils.table_to_book(document.getElementById("animeTable"));
  XLSX.writeFile(wb, "animes_firebase.xlsx");
};

searchInput.addEventListener("input", () => {
  const filtro = searchInput.value.toLowerCase();
  for (const row of tableBody.rows) {
    const titulo = row.cells[0].textContent.toLowerCase();
    row.style.display = titulo.includes(filtro) ? "" : "none";
  }
});


function mostrarDeshacer(backup) {
  const undoBox = document.createElement("div");
  undoBox.style.position = "fixed";
  undoBox.style.bottom = "20px";
  undoBox.style.left = "50%";
  undoBox.style.transform = "translateX(-50%)";
  undoBox.style.background = "#333";
  undoBox.style.color = "#fff";
  undoBox.style.padding = "10px 20px";
  undoBox.style.borderRadius = "10px";
  undoBox.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
  undoBox.innerHTML = `Serie eliminada. <button style="margin-left:10px;" id="undoBtn">Deshacer</button>`;

  document.body.appendChild(undoBox);

  document.getElementById("undoBtn").onclick = async () => {
    await db.collection("series").add(backup);
    loadData();
    document.body.removeChild(undoBox);
  };

  setTimeout(() => {
    if (document.body.contains(undoBox)) {
      document.body.removeChild(undoBox);
    }
  }, 10000);
}
