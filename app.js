document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    const toolsContainer = document.getElementById("tools-container");
    const editBtn = document.getElementById("editBtn");

    let isLoggedIn = false;
    let isEditMode = false;

    // Simulador de inicio de sesión
    function login() {
        isLoggedIn = true;
        logoutBtn.classList.remove("hidden");
        toolsContainer.classList.remove("hidden");
    }

    // Cerrar sesión
    logoutBtn.addEventListener("click", () => {
        isLoggedIn = false;
        logoutBtn.classList.add("hidden");
        toolsContainer.classList.add("hidden");
    });

    // Activar modo edición
    editBtn.addEventListener("click", () => {
        isEditMode = !isEditMode;
        const tableCells = document.querySelectorAll("#animeTable tbody td:not(:last-child)");
        tableCells.forEach(cell => {
            cell.contentEditable = isEditMode;
        });
    });

    login(); // Auto login para pruebas
});
