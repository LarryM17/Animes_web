
# 📺 Animes Web – v2.0

Aplicación web para gestionar tus animes favoritos. Permite añadir, buscar, editar y eliminar series con sincronización en Firebase. Esta es la versión principal (`main`), completamente funcional y con login de administrador.

---

## 🚀 Funcionalidades Principales

- ✅ **Login con Google** (solo usuarios autorizados pueden ver y editar)
- ✅ **Formulario para añadir animes**
- ✅ **Listado de animes en tabla editable**
- ✅ **Buscar por título**
- ✅ **Exportar tabla como Excel**
- ✅ **Borrar series con confirmación**
- ✅ **Modo oscuro/claro**
- ✅ **Diseño responsive para móviles y escritorio**

---

## 🧾 Estructura de datos por anime

| Campo                | Tipo       | Descripción                                 |
|----------------------|------------|---------------------------------------------|
| `titulo`             | Texto      | Título del anime (único, obligatorio)       |
| `temporada`          | Texto      | Última temporada vista                      |
| `temporadaPendiente` | Texto      | Temporada que se está esperando             |
| `fecha`              | Fecha      | Fecha de estreno o seguimiento              |
| `importante`         | Boolean    | Si es un anime prioritario para ti          |
| `enEspera`           | Boolean    | Si está en espera (por defecto: false)      |
| `comentarios`        | Texto      | Comentarios adicionales                     |

---

## 🔐 Seguridad

- Solo los usuarios autenticados pueden interactuar con la base de datos.
- El acceso se gestiona por UID en Firebase Authentication + reglas de Firestore.

---

## 🔧 Cómo usar

1. Inicia sesión con tu cuenta de Google autorizada
2. Añade tus animes usando el formulario
3. Busca, borra o exporta según necesites
4. Todo se guarda automáticamente en Firebase

---

## 📁 Ramas

- `main`: versión estable y pública.
- `pruebas`: versión en desarrollo con funcionalidades experimentales.

---

## 📦 Stack Tecnológico

- HTML, CSS y JavaScript puro
- Firebase Firestore + Auth
- GitHub Pages

---

**Creado por [Tu Nombre o Usuario] – 2025**
