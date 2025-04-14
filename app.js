
// Fragmento base que activa modo edición al pulsar "Editar tabla"
let modoEdicionActivo = false;

const btnEditarTabla = document.getElementById("editarTablaBtn");

btnEditarTabla.addEventListener("click", () => {
  modoEdicionActivo = !modoEdicionActivo;
  btnEditarTabla.textContent = modoEdicionActivo ? "🔒 Bloquear edición" : "✏️ Editar tabla";

  document.querySelectorAll("#animeTable tbody tr").forEach(fila => {
    Array.from(fila.cells).forEach((celda, i) => {
      if (i < 4 || i === 6) {
        if (modoEdicionActivo) {
          celda.setAttribute("contenteditable", "true");
        } else {
          celda.removeAttribute("contenteditable");
        }
      } else if (i === 4 || i === 5) {
        const checkbox = celda.querySelector("input[type='checkbox']");
        if (checkbox) checkbox.disabled = !modoEdicionActivo;
      }
    });
  });
});

function agregarFila(datos, idDoc) {
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${datos.titulo}</td>
    <td>${datos.temporada}</td>
    <td>${datos.temporadaPendiente}</td>
    <td>${datos.fecha}</td>
    <td><input type="checkbox" ${datos.importante ? "checked" : ""} ${modoEdicionActivo ? "" : "disabled"} /></td>
    <td><input type="checkbox" ${datos.enEspera ? "checked" : ""} ${modoEdicionActivo ? "" : "disabled"} /></td>
    <td>${datos.comentarios}</td>
    <td>
      <button onclick="guardarCambios(this, '${idDoc}')">💾</button>
      <button onclick="borrarFila('${idDoc}')">🗑️</button>
    </td>
  `;
  document.querySelector("#animeTable tbody").appendChild(fila);

  fila.querySelectorAll("td").forEach((celda, i) => {
    if (i < 4 || i === 6) {
      if (modoEdicionActivo) celda.setAttribute("contenteditable", "true");
    } else if (i === 4 || i === 5) {
      const checkbox = celda.querySelector("input[type='checkbox']");
      if (checkbox) checkbox.disabled = !modoEdicionActivo;
    }
  });
}

async function guardarCambios(boton, idDoc) {
  const fila = boton.closest("tr");
  const celdas = fila.querySelectorAll("td");

  const nuevosDatos = {
    titulo: celdas[0].textContent.trim(),
    temporada: celdas[1].textContent.trim(),
    temporadaPendiente: celdas[2].textContent.trim(),
    fecha: celdas[3].textContent.trim(),
    importante: celdas[4].querySelector("input").checked,
    enEspera: celdas[5].querySelector("input").checked,
    comentarios: celdas[6].textContent.trim()
  };

  await db.collection("series").doc(idDoc).update(nuevosDatos);
  alert("✅ Cambios guardados");
}
