
function processExcel(data) {
  const expectedColumns = [
    "titulo",
    "temporada",
    "temporada pendiente",
    "fecha",
    "importante",
    "comentarios"
  ];
  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = "";

  if (!data || data.length === 0) {
    alert("❌ El archivo está vacío.");
    return;
  }

  const fileColumns = Object.keys(data[0]);

  const missingColumns = expectedColumns.filter(col => !fileColumns.includes(col));
  if (missingColumns.length > 0) {
    alert("❌ El archivo no tiene las columnas esperadas: " + missingColumns.join(", "));
    return;
  }

  data.forEach(row => {
    const enEspera = row["enEspera"] === undefined ? false : row["enEspera"];
    const importante = row["importante"] === true;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row["titulo"]}</td>
      <td>${row["temporada"]}</td>
      <td>${row["temporada pendiente"]}</td>
      <td>${row["fecha"]}</td>
      <td><input type="checkbox" ${importante ? "checked" : ""} disabled></td>
      <td><input type="checkbox" ${enEspera ? "checked" : ""} disabled></td>
      <td>${row["comentarios"]}</td>
    `;
    tableBody.appendChild(tr);
  });
}
