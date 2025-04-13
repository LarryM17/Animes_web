
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const form = document.getElementById("animeForm");

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log("Usuario conectado:", user.email);
    form.style.display = "block";
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    loadData();
  } else {
    console.log("Usuario no autenticado");
    form.style.display = "none";
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    document.getElementById('animeTableBody').innerHTML = "";
  }
});

loginBtn.addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(() => console.log("Sesión iniciada"))
    .catch((error) => alert("Error al iniciar sesión: " + error.message));
});

logoutBtn.addEventListener("click", () => {
  firebase.auth().signOut();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const titulo = document.getElementById("titulo").value.trim();
  if (!titulo) {
    alert("El título es obligatorio");
    return;
  }

  const existing = await db.collection("series").where("titulo", "==", titulo).get();
  if (!existing.empty) {
    alert("Ya existe un anime con ese título.");
    return;
  }

  const ultimaTemp = document.getElementById("ultimaTemp").value;
  const tempEspera = document.getElementById("tempEspera").value;
  const fechaEstreno = document.getElementById("fechaEstreno").value;
  const importante = document.getElementById("importante").checked;
  const enEspera = document.getElementById("enEspera").checked;
  const comentarios = document.getElementById("comentarios").value;

  try {
    await db.collection("series").add({
      titulo,
      ultimaTemp,
      tempEspera,
      fechaEstreno,
      importante,
      enEspera,
      comentarios,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    form.reset();
    loadData();
  } catch (err) {
    alert("Error al guardar: " + err.message);
  }
});

function loadData() {
  const tbody = document.getElementById("animeTableBody");
  tbody.innerHTML = "";

  const filtrar = document.getElementById("filtrarEspera").checked;

  db.collection("series").orderBy("timestamp", "desc").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;

      if (filtrar && !data.enEspera) return;

      const row = document.createElement("tr");

      row.innerHTML = `
        <td><input data-id="${id}" data-field="titulo" type="text" value="${data.titulo || ""}" /></td>
        <td><input data-id="${id}" data-field="ultimaTemp" type="text" value="${data.ultimaTemp || ""}" /></td>
        <td><input data-id="${id}" data-field="tempEspera" type="text" value="${data.tempEspera || ""}" /></td>
        <td><input data-id="${id}" data-field="fechaEstreno" type="date" value="${data.fechaEstreno || ""}" /></td>
        <td><input data-id="${id}" data-field="importante" type="checkbox" ${data.importante ? "checked" : ""} /></td>
        <td><input data-id="${id}" data-field="enEspera" type="checkbox" ${data.enEspera ? "checked" : ""} /></td>
        <td><textarea data-id="${id}" data-field="comentarios">${data.comentarios || ""}</textarea></td>
      `;

      tbody.appendChild(row);
    });
  });
}

document.getElementById("filtrarEspera").addEventListener("change", loadData);

document.addEventListener("change", async (e) => {
  const target = e.target;
  if (target.dataset && target.dataset.id && target.dataset.field) {
    const id = target.dataset.id;
    const field = target.dataset.field;
    let value;

    if (target.type === "checkbox") {
      value = target.checked;
    } else {
      value = target.value.trim();
    }

    if (field === "titulo") {
      const checkDup = await db.collection("series")
        .where("titulo", "==", value)
        .get();

      const duplicate = !checkDup.empty && checkDup.docs[0].id !== id;
      if (duplicate) {
        alert("Ya existe un anime con ese título.");
        loadData();
        return;
      }
    }

    try {
      await db.collection("series").doc(id).update({ [field]: value });
    } catch (err) {
      alert("Error al actualizar: " + err.message);
    }
  }
});
