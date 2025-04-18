# 📺 Animes Web – v4.5

Aplicación web para gestionar tus animes favoritos de forma visual, rápida y segura. Esta versión incluye login con Google, edición en línea, exportación/importación Excel, modo oscuro, verificación de duplicados y diseño responsive mejorado.

---

## 🚀 Funcionalidades Principales

- 🔐 **Autenticación con Google**
  - Solo usuarios autenticados pueden acceder a funciones administrativas como editar, eliminar o añadir.
  - Botones y formularios se ocultan automáticamente para visitantes no logueados.

- 📝 **Formulario para añadir nuevos animes**
  - Incluye título, temporada actual, temporada pendiente, fecha de estreno, favorito, en espera y comentarios.
  - Verificación para evitar duplicados.

- 📋 **Tabla con todos los animes**
  - Datos sincronizados con Firebase Firestore.
  - Modo edición habilitable para editar celdas directamente y guardar cambios.
  - Botón para eliminar fila con confirmación.

- 🔍 **Buscador en tiempo real**
  - Filtra automáticamente por título conforme se escribe.

- 🎯 **Filtros por categoría**
  - Checkbox para mostrar solo favoritos (`Favoritos`)
  - Checkbox para mostrar solo animes en espera (`En espera`)

- 📦 **Exportar tabla a Excel**
  - Exporta directamente el contenido visible de la tabla a un archivo `.xlsx`.

- 📥 **Importar desde Excel**
  - Nuevo botón para subir un archivo `.xlsx`.
  - Detecta columnas automáticamente (sin importar el orden).
  - Admite textos "VERDADERO"/"FALSO" para checkboxes.
  - Evita duplicados (ignora títulos ya existentes, sin importar mayúsculas o espacios).
  - Añade por defecto `enEspera = false` si la columna no existe.

- 🌓 **Modo oscuro / claro**
  - Alterna el tema de la página para mayor comodidad visual.

- 📱 **Diseño responsive**
  - Interfaz adaptada a dispositivos móviles y tablets.
  - Inputs y botones se reorganizan para ocupar toda la pantalla en móviles.

- 📂 **Menú desplegable**
  - Acceso a funciones (mostrar formulario, exportar/importar Excel, editar tabla, cambiar tema) a través de un botón tipo hamburguesa.
  - Filtros y buscador siempre visibles y centrados, fuera del menú.

---

## 🧾 Estructura de datos por anime

| Campo                | Tipo       | Descripción                                 |
|----------------------|------------|---------------------------------------------|
| `titulo`             | Texto      | Título del anime (único, obligatorio)       |
| `temporada`          | Texto      | Última temporada vista                      |
| `temporadaPendiente` | Texto      | Temporada que se está esperando             |
| `fecha`              | Texto      | Fecha de estreno o seguimiento              |
| `favorito`           | Boolean    | Si es un anime prioritario para ti          |
| `enEspera`           | Boolean    | Si está en espera (false por defecto)       |
| `comentarios`        | Texto      | Comentarios adicionales                     |

---

## 🔐 Seguridad

- Login con cuenta de Google
- Solo los usuarios autenticados pueden interactuar con la base de datos (leer/escribir)
- Protección visual y funcional para formularios y controles administrativos

---

## 🧰 Cómo usar

1. Inicia sesión con tu cuenta de Google autorizada
2. Añade tus animes usando el formulario o importa desde Excel
3. Usa el buscador o filtros para localizar lo que necesites
4. Activa el modo edición para cambiar o eliminar datos
5. Exporta a Excel cuando quieras guardar una copia
6. Alterna el tema claro/oscuro según tu preferencia

---

## 📦 Stack Tecnológico

- HTML + CSS + JavaScript puro
- Firebase (Auth + Firestore)
- Librería [SheetJS](https://sheetjs.com/) para importar/exportar Excel
- GitHub Pages (opcional para despliegue)

---

**Creado por Larry – 2025**
